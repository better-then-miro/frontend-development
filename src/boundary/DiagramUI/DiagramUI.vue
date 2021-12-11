<template>
  <div style="display:flex">
    <svg @click="updateInfo" id="mySvg" class="editorSvg" height="700" width="700"></svg>
    <div style="display:flex; flex-direction: column; margin-top: 20px">
      <div>
        <input id="blockTitle" type="text" placeholder="Enter block title"
               name="blockTitle" v-model="blockTitle">
        <div>
          <input type="radio" id="contactChoice1"
                 name="blockType" value="Class" v-model="blockType">
          <label for="contactChoice1">Class</label>
          <input type="radio" id="contactChoice2"
                 name="blockType" value="Use-case" v-model="blockType">
          <label for="contactChoice2">Use-case</label>
        </div>
        <button type="button" class="btn icon-plus" v-on:click="addNewBlock()">
          Add new block
        </button>
      </div>
      <editing-panel v-if="selectedBlockSVG!=null"
                     v-bind:selected-block-svg="selectedBlockSVG"
                     v-bind:selected-block-entity="selectedBlockEntity"
                     v-on:close-panel="selectedBlockSVG=null"/>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import Snap from 'snapsvg-cjs';
import { setBounds } from './drag';
import { sel } from './scale';
import { createNewBlock } from '../serverProtocol';
import EditingPanel from '../EditingPanel';
import BlockView from '../../entity/blockView';
import Block from '../../entity/block';


export default {
  name: 'DiagramUi',
  components: { EditingPanel },
  props: ['currentDiagram'], // TODO only blocks and links needed to this boundary
  data() {
    return {
      snap: null,
      blockTitle: '',
      blockType: null,
      selectedBlockSVG: null,
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
      });
    },

    addNewBlock() {
      // TODO: Find a better way to handle blocks with an empty title
      // TODO: (or a title that only contains spaces)
      if (this.blockType != null && this.blockTitle.replaceAll(' ', '') !== '') {
        const properties = {
          dId: this.currentDiagram.Id,
          type: this.blockType,
          coords: [250, 250],
          width: 100,
          height: 50,
        };

        createNewBlock(properties)
          .then((blockId) => {
            const newBlock = new Block(blockId, properties.type,
              properties.coords[0], properties.coords[1], properties.width, properties.height);
            this.currentDiagram.blocks.push(newBlock);
            const blockView = new BlockView(newBlock, this.snap);
            blockView.redrawOnSnap();
          },
          );
      }
    },

    updateInfo() {
      this.selectedBlockSVG = sel;
    },
  },

  computed: {
    selectedBlockEntity() {
      if (this.selectedBlockSVG == null) return null;
      let res;
      for (let i = 0; i < this.currentDiagram.blocks.length; i += 1) {
        if (this.currentDiagram.blocks[i].Id === this.selectedBlockSVG.data('Id')) {
          res = this.currentDiagram.blocks[i];
          break;
        }
      }
      return res;
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
