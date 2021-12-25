<template>
  <div style="display:flex; flex-direction: row; margin-top: 20px">
    <diagram-ui v-if="showDiagramWindow" v-bind:currentDiagram="this.currentDiagram"
                ref="diagramUI" :key="keyOfDiagramUI"
                v-on:ready-add-new-link="addNewLink"
                v-on:block-view-selected="changeSelected"/>
    <div style="display:flex; flex-direction: column">
      <side-panel v-on:create-block="addNewBlock"
                  v-bind:is-link-add-mode="isLinkAddMode"
                  v-bind:supported-block-types="supportedBlocks"
                  v-on:toggle-link-mode="toggleLinkMode"
                  ref="sidePanel"/>
      <editing-panel v-if="selectedBlockView!=null&&isLinkAddMode===false"
                     v-bind:selected-block-view="selectedBlockView"
                     v-on:close-panel="selectedBlockView=null"
                     v-on:apply-changes="changeFields"
                     v-on:item-deleted="updateAdditionalFields"/>
    </div>
    <!--  TODO add block boundary component  -->
  </div>
</template>

<script>
/* eslint-disable no-console */
import DiagramUi from '../boundary/DiagramUI/DiagramUI';
import SidePanel from '../boundary/SidePanel/SidePanel';
import EditingPanel from '../boundary/EditingPanel';
import { createNewBlock, createNewLink, getDiagramContent, updateBlockProperties } from '../boundary/serverProtocol';
import Block from '../entity/block';
import Link from '../entity/link';
import Diagram from '../entity/diagram';


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
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      getDiagramContent(this.currentDiagram.Id)
        .then((data) => {
          data.blocks.forEach((block) => {
            this.currentDiagram.blocks.push(new Block(block.Id, block.Type,
              block.coords[0], block.coords[1], block.width, block.height,
              block.title, block.description, block.additionalFields));
          });
          data.links.forEach((link) => {
            this.currentDiagram.links.push(new Link(link.Id, link.Type,
              link.sId, link.tId));
          });
        },
        ).then(() => {
          this.showDiagramWindow = true;
        });
    },

    addNewBlock(fields) {
      const properties = {
        dId: this.currentDiagram.Id,
        Type: fields.Type,
        coords: [250, 250],
        width: 100,
        height: 50,
        title: fields.title,
      };

      createNewBlock(properties)
        .then((blockId) => {
          console.log('New block ID:', blockId);
          const newBlock = new Block(blockId, properties.Type,
            properties.coords[0], properties.coords[1], properties.width,
            properties.height, properties.title);
          this.currentDiagram.blocks.push(newBlock);
          this.$refs.diagramUI.drawNewBlock(newBlock);
        },
        );
    },

    redrawDiagramUI() {
      this.keyOfDiagramUI += 1;
    },

    toggleLinkMode(properties) {
      this.isLinkAddMode = properties.bool;
      this.$refs.diagramUI.toggleLinkMode(properties);
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
      createNewLink(properties)
        .then((linkId) => {
          console.log('New Link ID:', linkId);
          const newLink = new Link(linkId, properties.Type,
            properties.sId, properties.tId);
          this.currentDiagram.links.push(newLink);
          this.$refs.diagramUI.drawNewLink();
          this.$refs.sidePanel.clear();
        },
        );
    },

    changeSelected(blockView) {
      this.selectedBlockView = blockView;
    },

    changeFields(data) {
      this.selectedBlockView.block.additionalFields = data.additionalFields;
      this.selectedBlockView.block.title = data.title;
      this.selectedBlockView.block.description = data.description;
      updateBlockProperties(this.selectedBlockView.block);
      this.$refs.diagramUI.changeFields();
    },

    updateAdditionalFields(newAdditionFieldsDict) {
      this.selectedBlockView.block.additionalFields = newAdditionFieldsDict;
      updateBlockProperties(this.selectedBlockView.block);
      this.$refs.diagramUI.changeFields();
    },
  },

  computed: {
    supportedBlocks() {
      // TODO free/strict restrictions
      return ['Class', 'Use-case', 'Actor'];
    },
  },
};
</script>

<style scoped>

</style>
