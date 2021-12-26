<template>
  <svg @click="updateInfo" id="mySvg" class="editorSvg" height="700" width="700"></svg>
</template>

<script>
/* eslint-disable no-console */
import Snap from 'snapsvg-cjs';
import { setBounds } from './drag';
import { sel } from './scale';
import BlockView from '../SnapUtils/blockView';
import '../SnapUtils/connection';
import Diagram from '../../entity/diagram';

export default {
  name: 'DiagramUi',
  props: {
    currentDiagram: Diagram,
  },
  emits: {
    'ready-add-new-link': { sourceID: Number, targetID: Number },
    'block-view-selected': BlockView,
    // TODO return only block entity and make changes in View in this component
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
          this.snapLinks.push(this.snap.connection(sBlockView[0], tBlockView[0], link.Type));
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

    deleteLink(link) {
      const index = this.snapLinks.indexOf(link);
      if (index > -1) {
        this.snapLinks.splice(index, 1);
        link.line.remove();
        link.bg.remove();
        if (link.arrow !== undefined) {
          link.arrow.remove();
        }
      }
    },

    deleteBlock(parameters) {
      const blockToDelete = parameters.blockToDelete;
      blockToDelete.removeLinkPoints();
      blockToDelete.blockGroup.remove();

      const blockId = blockToDelete.block.Id;
      const linksToRemove = [];
      this.snapLinks.forEach((link) => {
        const fromBlockID = link.from.block.Id;
        const toBlockID = link.to.block.Id;
        if ((fromBlockID === blockId) || (toBlockID === blockId)) {
          linksToRemove.push(link);
        }
      });

      linksToRemove.forEach((link) => {
        this.deleteLink(link);
      });
    },

    updateInfo() {
      this.selectedBlockView = sel;
      this.$emit('block-view-selected', this.selectedBlockView);
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
