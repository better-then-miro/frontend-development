<template>
  <div style="display:flex; flex-direction: row; margin-top: 20px">
    <diagram-ui v-if="showDiagramWindow" v-bind:currentDiagram="this.currentDiagram"
                ref="diagramUI" :key="keyOfDiagramUI"
                v-on:ready-add-new-link="addNewLink"
                v-on:block-view-selected="changeSelected"
                v-on:link-selected="changeSelectedLink"
                v-on:turn-off-link-mode="turnOffLinkMode"/>
    <div style="display:flex; flex-direction: column">
      <side-panel v-on:create-block="addNewBlock"
                  v-bind:is-link-add-mode="isLinkAddMode"
                  v-bind:supported-block-types="supportedBlocks"
                  v-bind:supported-link-types="supportedLinks"
                  v-on:toggle-link-mode="toggleLinkMode"
                  ref="sidePanel"/>
      <editing-panel v-if="(selectedBlockView!=null || selectedLink!=null)&&isLinkAddMode===false"
                     v-bind:selected-block-view="selectedBlockView"
                     v-bind:selected-link="selectedLink"
                     v-on:close-panel="selectedBlockView.removeLinkPoints();selectedBlockView=null"
                     v-on:apply-changes="changeFields"
                     v-on:item-deleted="updateAdditionalFields"
                     v-on:delete-block="deleteBlockFromSnap"
                     v-on:delete-link="deleteLinkFromSnap"/>
    </div>
    <!--  TODO add block boundary component  -->
  </div>
</template>

<script>
/* eslint-disable no-console */
import DiagramUi from '../boundary/DiagramUI/DiagramUI';
import SidePanel from '../boundary/SidePanel/SidePanel';
import EditingPanel from '../boundary/EditingPanel';
import {
  createNewBlock,
  createNewLink,
  getDiagramContent,
  updateBlockAdditionalProperties,
  deleteLink,
  deleteBlock,
  initSocketIo,
  updateBlockTitleProperty,
  updateBlockDescriptionProperty,
  registerModifierCallback, registerDeleteBlockCallback,
  registerAddNewLinkCallback, registerAddNewBlockCallback, registerDeleteLinkCallback,
} from '../boundary/serverProtocol';
import Block from '../entity/block';
import Link from '../entity/link';
import Diagram from '../entity/diagram';

const diagramTypes = require('../boundary/SnapUtils/assets/diagramTypes.json');

export default {
  name: 'DiagramController',
  components: { DiagramUi, SidePanel, EditingPanel },
  props: {
    currentDiagram: Diagram,
  },

  data() {
    return {
      showDiagramWindow: false,
      isLinkAddMode: false,
      keyOfDiagramUI: 0,
      selectedBlockView: null,
      selectedLink: null,
      newBlockProperties: null,
      newLinkProperties: null,
      versionNo: null,
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      initSocketIo();
      getDiagramContent(this.currentDiagram.Id, this.loadDiagramContent);
      registerModifierCallback(this.blockModifierCallback);
      registerDeleteBlockCallback(this.blockDeleteCallback);
      registerDeleteLinkCallback(this.deleteLinkCallback);
      registerAddNewLinkCallback(this.addNewLinkHandler);
      registerAddNewBlockCallback(this.addNewBlockHandler);
    },

    blockModifierCallback(data) {
      console.log('blockModifierCallback. Data:', data);
      if (data.code != null && data.code !== 200) {
        console.log('Error occurred in blockModifierCallback, error code: ', data.code);
        return;
      }
      if (data.version != null && Math.abs(data.version - this.versionNo)) {
        getDiagramContent(this.currentDiagram.Id, this.loadDiagramContent);
        return;
      }
      this.$refs.diagramUI.snapBlocks.forEach((blockView) => {
        if (blockView.block.Id === data.Id) {
          if (data.coords !== undefined) {
            blockView.block.setCoords(data.coords);
          }
          if (data.width !== undefined) {
            blockView.block.setWidth(data.width);
          }
          if (data.width !== undefined) {
            blockView.block.setHeight(data.height);
          }
          if (data.title !== undefined) {
            blockView.block.setTitle(data.title);
          }
          if (data.description !== undefined) {
            blockView.block.setDescription(data.description);
          }
          if (data.additionalFields !== undefined) {
            blockView.block.setAdditionalFields(data.additionalFields);
          }

          blockView.redrawOnSnap();
        }
      });

      if (data.version != null) {
        this.versionNo = data.version;
      }
    },

    blockDeleteCallback(data) {
      if (data.code != null && data.code !== 200) {
        console.log('Error occurred in blockDeleteCallback, error code: ', data.code);
        return;
      }
      if (data.version != null && Math.abs(data.version - this.versionNo)) {
        getDiagramContent(this.currentDiagram.Id, this.loadDiagramContent);
        return;
      }
      let blockToDelete;
      this.$refs.diagramUI.snapBlocks.forEach((blockView) => {
        if (blockView.block.Id === data.bId) {
          blockToDelete = blockView;
        }
      });

      this.selectedBlockView = null;
      this.selectedLink = null;
      blockToDelete.removeLinkPoints();
      blockToDelete.blockGroup.remove();

      const blockId = blockToDelete.block.Id;
      const linksToRemove = [];
      this.$refs.diagramUI.snapLinks.forEach((link) => {
        const fromBlockID = link.from.block.Id;
        const toBlockID = link.to.block.Id;
        if ((fromBlockID === blockId) || (toBlockID === blockId)) {
          linksToRemove.push(link);
        }
      });

      linksToRemove.forEach((link) => {
        this.deleteLinkFromSnap(link, false);
      });

      const index = this.$refs.diagramUI.snapBlocks.indexOf(blockToDelete);
      this.$refs.diagramUI.snapBlocks.splice(index, 1);
      this.selectedBlockView = null;

      if (data.version != null) {
        this.versionNo = data.version;
      }
    },

    deleteLinkCallback(data) {
      if (data.code != null && data.code !== 200) {
        console.log('Error occurred in deleteLinkCallback, error code: ', data.code);
        return;
      }
      if (data.version != null && Math.abs(data.version - this.versionNo)) {
        getDiagramContent(this.currentDiagram.Id, this.loadDiagramContent);
        return;
      }
      let linkToDelete;
      this.$refs.diagramUI.snapLinks.forEach((link) => {
        console.log(link);
        if (link.lId === data.lId) {
          linkToDelete = link;
        }
      });
      if (linkToDelete !== undefined) { this.deleteLinkFromSnap(linkToDelete, false); }
      if (data.version != null) {
        this.versionNo = data.version;
      }
    },

    // Callback for socketIO on getDiagramContentHandler
    loadDiagramContent(data) {
      if (data.code != null && data.code !== 200) {
        console.log('Error occurred in loadDiagramContent callback, error code: ', data.code);
        return;
      }
      if (data.version != null) {
        this.versionNo = data.version;
      }
      console.log('Diagram content ', data);
      data.blocks.forEach((block) => {
        this.currentDiagram.blocks.push(new Block(block.Id, block.Type,
          block.coords[0], block.coords[1], block.width, block.height,
          block.title, block.description, block.additionalFields));
      });
      data.links.forEach((link) => {
        this.currentDiagram.links.push(new Link(link.Id, link.Type,
          link.sId, link.tId));
      });
      this.showDiagramWindow = true;
    },

    // Make request to server
    addNewBlock(fields) {
      this.newBlockProperties = {
        dId: this.currentDiagram.Id,
        Type: fields.Type,
        coords: [250, 250],
        width: 80,
        height: 80,
        title: fields.title,
      };

      createNewBlock(this.newBlockProperties);
    },

    // Handler when server returns block ID
    addNewBlockHandler(blockData) {
      if (blockData.version != null && Math.abs(blockData.version - this.versionNo)) {
        getDiagramContent(this.currentDiagram.Id, this.loadDiagramContent);
        return;
      }
      console.log('New block ID:', blockData.Id);
      const newBlock = new Block(blockData.Id, blockData.Type,
        blockData.coords[0], blockData.coords[1],
        blockData.width, blockData.height,
        blockData.title);
      this.currentDiagram.blocks.push(newBlock);
      this.$refs.diagramUI.drawNewBlock(newBlock);
      this.newBlockProperties = null;
      if (blockData.version != null) {
        this.versionNo = blockData.version;
      }
    },

    deleteLinkFromSnap(linkToDelete, deleteFromServer = true) {
      this.selectedBlockView = null;
      this.selectedLink = null;
      const index = this.$refs.diagramUI.snapLinks.indexOf(linkToDelete);
      console.log('Delete link:', linkToDelete, index);
      if (index > -1) {
        this.$refs.diagramUI.snapLinks.splice(index, 1);
        linkToDelete.line.remove();
        linkToDelete.bg.remove();
        if (linkToDelete.arrow !== undefined) {
          linkToDelete.arrow.remove();
        }
      }
      if (deleteFromServer) {
        deleteLink(linkToDelete.lId);
      }
    },

    deleteBlockFromSnap(parameters) {
      const blockId = parameters.blockToDelete.block.Id;
      deleteBlock(blockId);
    },

    redrawDiagramUI() {
      this.keyOfDiagramUI += 1;
    },

    toggleLinkMode(properties) {
      this.isLinkAddMode = properties.bool;
      this.$refs.diagramUI.toggleLinkMode(properties);
    },

    turnOffLinkMode() {
      this.isLinkAddMode = false;
    },

    addNewLink(data) {
      const linkType = this.$refs.sidePanel.linkType;
      if (linkType == null) {
        return;
      }
      if (data.targetID == null || data.sourceID == null) {
        console.log('Link creation error: null as ID');
        return;
      }
      const properties = {
        dId: this.currentDiagram.Id,
        Type: linkType,
        sId: data.sourceID,
        tId: data.targetID,
      };
      console.log('Creating new link');
      // making request to the server
      this.newLinkProperties = properties;
      createNewLink(properties);
    },
    // Handler when server returns link ID
    addNewLinkHandler(linkData) {
      if (linkData.version != null && Math.abs(linkData.version - this.versionNo)) {
        getDiagramContent(this.currentDiagram.Id, this.loadDiagramContent);
        return;
      }
      console.log('New Link ID:', linkData.Id);
      const newLink = new Link(linkData.Id, linkData.Type,
        linkData.sId, linkData.tId);

      let sourceView;
      let targetView;
      this.$refs.diagramUI.snapBlocks.forEach((blockView) => {
        if (blockView.block.Id === linkData.sId) {
          sourceView = blockView;
        }
        if (blockView.block.Id === linkData.tId) {
          targetView = blockView;
        }
      });
      this.currentDiagram.links.push(newLink);
      this.$refs.diagramUI.drawNewLink(linkData.Type, linkData.Id, sourceView, targetView);
      this.$refs.sidePanel.clear();
      this.newLinkProperties = null;
      if (linkData.version != null) {
        this.versionNo = linkData.version;
      }
    },

    changeSelected(blockView) {
      this.selectedBlockView = blockView;
    },

    changeSelectedLink(link) {
      if (this.selectedLink !== null) {
        this.selectedLink.changeColor('black');
      }
      this.selectedLink = link;
      if (link !== null) {
        link.changeColor('blue');
      }
    },

    changeFields(data) {
      this.selectedBlockView.removeLinkPoints();

      if (this.selectedBlockView.block.title !== data.title) {
        updateBlockTitleProperty(this.selectedBlockView.block.Id, data.title);
        // Later this modification will happen in the handler
        this.selectedBlockView.block.title = data.title;
      }

      if (this.selectedBlockView.block.description !== data.description) {
        updateBlockDescriptionProperty(this.selectedBlockView.block.Id, data.description);
        // Later this modification will happen in the handler
        this.selectedBlockView.block.description = data.description;
      }

      console.log('New add fields', data.additionalFields);
      updateBlockAdditionalProperties(this.selectedBlockView.block.Id,
        data.additionalFields);
      // Later this modification will happen in the handler
      this.selectedBlockView.block.additionalFields = data.additionalFields;

      this.$refs.diagramUI.changeFields();
    },

    updateAdditionalFields(newAdditionFieldsDict) {
      this.selectedBlockView.removeLinkPoints();
      this.selectedBlockView.block.additionalFields = newAdditionFieldsDict;
      updateBlockAdditionalProperties(this.selectedBlockView.block.Id,
        this.selectedBlockView.block.additionalFields);
      this.$refs.diagramUI.changeFields();
    },
  },

  computed: {
    supportedBlocks() {
      let blocks = [];
      if (this.currentDiagram.mode.toLowerCase() === 'free') {
        const diagramType = diagramTypes
          .filter(elem => elem.type === 'free')[0];
        console.log(diagramType);
        blocks = diagramType.blocks;
      } else {
        const diagramType = diagramTypes
          .filter(elem => elem.type === this.currentDiagram.Type.toLowerCase())[0];
        if (diagramType === undefined) {
          console.log(`Unsupported schema: ${this.currentDiagram.Type.toLowerCase()}`);
        } else {
          console.log(diagramType);
          blocks = diagramType.blocks;
        }
      }
      return blocks;
    },
    supportedLinks() {
      let links = [];
      if (this.currentDiagram.mode.toLowerCase() === 'free') {
        const diagramType = diagramTypes
          .filter(elem => elem.type === 'free')[0];
        console.log(diagramType);
        links = diagramType.links;
      } else {
        const diagramType = diagramTypes
          .filter(elem => elem.type === this.currentDiagram.Type.toLowerCase())[0];
        if (diagramType === undefined) {
          console.log(`Unsupported schema: ${this.currentDiagram.Type.toLowerCase()}`);
        } else {
          console.log(diagramType);
          links = diagramType.links;
        }
      }
      return links;
    },
  },
};
</script>

<style scoped>

</style>
