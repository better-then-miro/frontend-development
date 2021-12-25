<template>
  <div style="display:flex">
    <svg @click="updateInfo" id="mySvg" class="editorSvg" height="700" width="700"></svg>
    <div style="display:flex; flex-direction: column; margin-top: 20px">
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
import { updateBlockProperties } from '../serverProtocol';
import EditingPanel from '../EditingPanel';
import BlockView from '../SnapUtils/blockView';
import SidePanel from '../SidePanel/SidePanel';
import '../SnapUtils/connection';
import Diagram from '../../entity/diagram';

export default {
  name: 'DiagramUi',
  components: { SidePanel, EditingPanel },
  props: {
    currentDiagram: Diagram,
  },
  emits: {
    'ready-add-new-link': { sourceID: Number, targetID: Number },
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

    // It is better to render new block than rerender all canvas
    drawNewBlock(newBlock) {
      const blockView = new BlockView(newBlock, this.snap, this.snapLinks);
      blockView.redrawOnSnap();
      this.snapBlocks.push(blockView);
    },

    updateInfo() {
      this.selectedBlockView = sel;
      if (this.isLinkAddMode) {
        if (this.linkSourceBlock != null && this.linkSourceBlock.block.Id !== sel.block.Id) {
          this.$emit('ready-add-new-link',
            { sourceID: this.linkSourceBlock.block.Id, targetID: sel.block.Id });
        } else {
          this.linkSourceBlock = sel;
        }
      } else {
        this.linkSourceBlock = null;
      }
    },

    drawNewLink() {
      console.log('Drawing new link');
      if (sel == null || this.linkSourceBlock == null) {
        console.log('Error drawing new link');
        return;
      }
      this.snapLinks.push(this.snap.connection(this.linkSourceBlock, sel, '#333', '#111'));
      this.linkSourceBlock = null;
      this.isLinkAddMode = false;
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
