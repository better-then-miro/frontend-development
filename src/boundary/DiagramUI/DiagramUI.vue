<template>
  <div style="display:flex">
    <svg @click="updateInfo" id="mySvg" class="editorSvg" height="700" width="700"></svg>
    <div style="display:flex; flex-direction: column; margin-top: 20px">
      <side-panel v-on:create-block="addNewBlock"
                  v-bind:is-link-add-mode="isLinkAddMode"
                  v-on:toggle-link-mode="toggleLinkMode"
                  v-on:add-new-link="addNewLink"
                  ref="sidePanel"/>
      <editing-panel v-if="selectedBlockView!=null&&isLinkAddMode===false"
                      v-bind:selected-block-view="selectedBlockView"
                      v-on:close-panel="selectedBlockView=null"
                      v-on:apply-changes="changeFields"/>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import Snap from 'snapsvg-cjs';
import { setBounds } from './drag';
import { sel } from './scale';
import { createNewBlock, createNewLink, updateBlockProperties } from '../serverProtocol';
import EditingPanel from '../EditingPanel';
import BlockView from '../SnapUtils/blockView';
import Block from '../../entity/block';
import Link from '../../entity/link';
import SidePanel from '../SidePanel/SidePanel';
import '../SnapUtils/connection';
import Diagram from '../../entity/diagram';

export default {
  name: 'DiagramUi',
  components: { SidePanel, EditingPanel },
  props: {
    currentDiagram: Diagram,
  },
  data() {
    return {
      snap: null,
      selectedBlockView: null,
      snapBlocks: [],
      snapLinks: [],
      linkSourceBlock: null,
      isLinkAddMode: false,
    };
  },

  mounted() {
    this.snap = Snap('#mySvg');
    this.init();
  },

  methods: {
    init() {
      setBounds(10, 10, 710, 710);
      this.snap.attr({ viewBox: '0 0 700 700' });
      this.snap.rect(0, 0, 700, 700).attr({ fill: 'none', stroke: 'black' });
      this.currentDiagram.blocks.forEach((block) => {
        const blockView = new BlockView(block, this.snap, this.snapLinks);
        blockView.redrawOnSnap();
        this.snapBlocks.push(blockView);
      });
      this.currentDiagram.links.forEach((link) => {
        const sBlockView = this.snapBlocks.filter(blockView => blockView.block.Id === link.sId);
        const tBlockView = this.snapBlocks.filter(blockView => blockView.block.Id === link.tId);
        if (sBlockView.length === 1 && tBlockView.length === 1) {
          this.snapLinks.push(this.snap.connection(sBlockView[0], tBlockView[0], '#333', '#111'));
        } else {
          console.log('Incorrect link parameters!');
        }
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
          const blockView = new BlockView(newBlock, this.snap, this.snapLinks);
          blockView.redrawOnSnap();
          this.snapBlocks.push(blockView);
        },
        );
    },

    updateInfo() {
      this.selectedBlockView = sel;
      if (this.isLinkAddMode) {
        if (this.linkSourceBlock != null && this.linkSourceBlock.block.Id !== sel.block.Id) {
          this.$refs.sidePanel.addNewLink();
        } else {
          this.linkSourceBlock = sel;
        }
      } else {
        this.linkSourceBlock = null;
      }
    },

    addNewLink(data) {
      if (data.linkType == null) {
        return;
      }
      const properties = {
        dId: this.currentDiagram.Id,
        Type: data.linkType,
        sId: this.linkSourceBlock.block.Id,
        tId: sel.block.Id,
      };

      createNewLink(properties)
        .then((linkId) => {
          console.log('New Link ID:', linkId);
          const newLink = new Link(linkId, properties.Type,
            properties.sId, properties.tId);
          this.currentDiagram.links.push(newLink);
          this.snapLinks.push(this.snap.connection(this.linkSourceBlock, sel, '#333', '#111'));
          this.linkSourceBlock = null;
          this.isLinkAddMode = false;
        },
        );
    },

    toggleLinkMode(properties) {
      this.isLinkAddMode = properties.bool;
    },

    changeFields() {
      updateBlockProperties(this.selectedBlockView.block);
      this.selectedBlockView.redrawOnSnap();
    },
  },

};
</script>

<style scoped>
.editorSvg {
  /*border: 5px solid black;*/
  margin: 5px;
}
</style>
