<template>
  <div style="display:flex">
    <svg @click="updateInfo" id="mySvg" class="editorSvg" height="700" width="700"></svg>
    <div style="display:flex; flex-direction: column; margin-top: 20px">
      <side-panel v-on:create-block="addNewBlock"/>
      <editing-panel v-if="selectedBlockView!=null"
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
import { createNewBlock, updateBlockProperties } from '../serverProtocol';
import EditingPanel from '../EditingPanel';
import BlockView from '../../entity/blockView';
import Block from '../../entity/block';
import '../../entity/connection';
import SidePanel from '../SidePanel';

export default {
  name: 'DiagramUi',
  components: { SidePanel, EditingPanel },
  props: ['currentDiagram'], // TODO only blocks and links needed to this boundary
  data() {
    return {
      snap: null,
      blockTitle: '',
      blockType: null,
      selectedBlockView: null,
      snapBlocks: [],
      snapLinks: [],
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
        const blockView = new BlockView(block, this.snap);
        blockView.redrawOnSnap();
        this.snapBlocks.push(blockView);
        blockView.blockGroup.data('connections', this.snapLinks);
      });
      this.snapLinks.push(this.snap.connection(this.snapBlocks[0], this.snapBlocks[1], '#333', '#111'));
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
          const blockView = new BlockView(newBlock, this.snap);
          blockView.redrawOnSnap();
        },
        );
    },

    updateInfo() {
      this.selectedBlockView = sel;
    },

    changeFields(properties) {
      this.selectedBlockView.block.title = properties.title;
      this.selectedBlockView.block.description = properties.description;
      updateBlockProperties(this.selectedBlockView.block);
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
