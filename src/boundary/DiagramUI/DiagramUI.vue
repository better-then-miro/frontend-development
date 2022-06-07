<template>
  <svg  @click="updateInfo" id="mySvg" class="editorSvg"
        :height="height" :width="width" ref="canvas"></svg>
</template>

<script>
/* eslint-disable no-console */
import Snap from 'snapsvg-cjs';
import { setBounds } from './drag';
import { sel, selLink, selectLink, setBlockToNull, setLinkToNull } from './scale';
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
    'link-selected': Object,
    'turn-off-link-mode': null,
    // TODO return only block entity and make changes in View in this component
  },
  data() {
    return {
      snap: null,
      selectedBlockView: null,
      selectedLink: null,
      snapBlocks: [],
      snapLinks: [],
      linkSourceBlock: null,
      isLinkAddMode: false,
      height: 800,
      width: 800,
    };
  },

  mounted() {
    this.snap = Snap('#mySvg');
    this.init();
  },

  methods: {
    init() {
      const bcr = this.$refs.canvas.getBoundingClientRect();
      setBounds(bcr.x, bcr.y, bcr.x + bcr.width, bcr.y + bcr.height);
      this.snap.attr({ viewBox: `0 0 ${this.width} ${this.height}` });
      this.snap.rect(0, 0, this.width, this.height).attr({ fill: 'none', stroke: 'black', strokeWidth: 2 });
      this.currentDiagram.blocks.forEach((block) => {
        const blockView = new BlockView(block, this.snap, this.snapLinks);
        blockView.redrawOnSnap();
        this.snapBlocks.push(blockView);
      });
      this.currentDiagram.links.forEach((link) => {
        const sBlockView = this.snapBlocks.filter(blockView => blockView.block.Id === link.sId);
        const tBlockView = this.snapBlocks.filter(blockView => blockView.block.Id === link.tId);
        if (sBlockView.length === 1 && tBlockView.length === 1) {
          const newLink = this.snap.connection(sBlockView[0], tBlockView[0], link.Id, link.Type);
          newLink.line.click(selectLink);
          this.snapLinks.push(newLink);
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
      console.log(sel, selLink);
      if (sel !== null) {
        if (this.selectedBlockView === sel) {
          this.selectedBlockView.removeLinkPoints();
          this.selectedBlockView = null;
          setBlockToNull();
          this.$emit('block-view-selected', this.selectedBlockView);
        } else {
          if (this.selectedLink !== null) {
            this.selectedLink = null;
            setLinkToNull();
            this.$emit('link-selected', this.selectedLink);
          }
          console.log('Update block');
          this.selectedBlockView = sel;
          this.$emit('block-view-selected', this.selectedBlockView);
          if (this.isLinkAddMode) {
            if (this.linkSourceBlock != null && this.linkSourceBlock.block.Id !== sel.block.Id) {
              console.log('ready-add-new-link');
              this.$emit('ready-add-new-link',
                { sourceID: this.linkSourceBlock.block.Id, targetID: sel.block.Id });
            } else {
              this.linkSourceBlock = sel;
              console.log('first tap');
              console.log(this.linkSourceBlock);
            }
          } else {
            this.linkSourceBlock = null;
          }
        }
      }
      if (selLink !== null) {
        if (this.selectedLink === selLink) {
          this.selectedLink = null;
          setLinkToNull();
          this.$emit('link-selected', this.selectedLink);
        } else {
          if (this.selectedBlockView !== null) {
            this.selectedBlockView = null;
            setBlockToNull();
            this.$emit('block-view-selected', this.selectedBlockView);
          }
          this.selectedLink = selLink;
          this.$emit('link-selected', this.selectedLink);
        }
      }
    },

    drawNewLink(linkType, linkId, sId, tId) {
      console.log('Drawing new link');
      const newLink = this.snap.connection(sId, tId, linkId, linkType);
      newLink.line.click(selectLink);
      this.snapLinks.push(newLink);
      this.linkSourceBlock = null;
      this.isLinkAddMode = false;
      this.$emit('turn-off-link-mode');
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
