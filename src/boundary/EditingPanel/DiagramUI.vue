<template>
  <div style="display:flex; justify-content: space-around">
    <svg id="mySvg" class="editorSvg" width="500" height="500"></svg>
    <div style="display:flex; flex-direction: column; margin-top: 20px">
      <div>
        <input type="radio" id="contactChoice1"
               name="blockType" value="Class" v-model="blockType">
        <label for="contactChoice1">Class</label>

        <input type="radio" id="contactChoice2"
               name="blockType" value="Use-case" v-model="blockType">
        <label for="contactChoice2">Use-case</label>
        <button class="btn icon-plus" v-on:click="addNewBlock()">
          Add new block
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Snap from 'snapsvg-cjs';
import { dragMove, dragStart, dragStop, setBounds } from './drag';
import { turnOnscaleMode } from './scale';
import { getDiagramContent, createNewBlock } from '../serverProtocol';


export default {
  name: 'EditingPanel',
  props: ['currentDiagram'],
  data() {
    return {
      snap: null,
      blockType: null,
    };
  },

  mounted() {
    this.snap = Snap('#mySvg');
    this.init();
  },

  methods: {
    init() {
      setBounds(10, 10, 510, 510);
      this.snap.attr({ viewBox: '0 0 500 500' });
      getDiagramContent(this.currentDiagram.Id)
        .then((data) => {
          data.blocks.forEach((block) => {
            // eslint-disable-next-line no-console
            console.log('Block from getDiagramContent: ', block);
            let newBlock;
            let blockTitle;
            if (block.Type === 'Class') {
              newBlock = this.snap.rect(
                block.coords[0], block.coords[1],
                block.width, block.height);
              blockTitle = this.snap.text(
                block.coords[0] + Math.round(block.width / 2),
                block.coords[1] + Math.round(block.height / 2),
                'Block name',
              ).attr({ stroke: 'white', dominantBaseline: 'middle', textAnchor: 'middle' });
            } else if (block.Type === 'Use-case') {
              newBlock = this.snap.ellipse(
                block.coords[0], block.coords[1],
                Math.round(block.width / 2), Math.round(block.height / 2));
              blockTitle = this.snap.text(
                block.coords[0],
                block.coords[1],
                'Hehe',
              ).attr({ stroke: 'white', dominantBaseline: 'middle', textAnchor: 'middle' });
            }

            const blockGroup = this.snap.group(newBlock, blockTitle);
            blockGroup.data('Id', block.Id);
            blockGroup.data('Type', block.Type);
            blockGroup.drag(dragMove, dragStart, dragStop);
            blockGroup.data('snap', this.snap);
            blockGroup.data('isScaling', false);
            blockGroup.dblclick(turnOnscaleMode);
          });
        },
        );
    },

    addNewBlock() {
      if (this.blockType != null) {
        const properties = {
          dId: this.currentDiagram.Id,
          type: this.blockType,
          coords: [250, 250],
          width: 100,
          height: 50,
        };

        createNewBlock(properties)
          .then((blockId) => {
            // eslint-disable-next-line no-console
            console.log('New block id: ', blockId);
            let newBlock;
            let blockTitle;
            if (properties.type === 'Class') {
              newBlock = this.snap.rect(
                properties.coords[0], properties.coords[1],
                properties.width, properties.height);
              blockTitle = this.snap.text(
                properties.coords[0] + Math.round(properties.width / 2),
                properties.coords[1] + Math.round(properties.height / 2),
                'Block name',
              ).attr({ stroke: 'white', dominantBaseline: 'middle', textAnchor: 'middle' });
            } else if (properties.type === 'Use-case') {
              newBlock = this.snap.ellipse(
                properties.coords[0], properties.coords[1],
                Math.round(properties.width / 2), Math.round(properties.height / 2));
              blockTitle = this.snap.text(
                properties.coords[0],
                properties.coords[1],
                'Hehe',
              ).attr({ stroke: 'white', dominantBaseline: 'middle', textAnchor: 'middle' });
            }

            const blockGroup = this.snap.group(newBlock, blockTitle);
            blockGroup.data('Id', blockId);
            blockGroup.data('Type', properties.type);
            blockGroup.drag(dragMove, dragStart, dragStop);
            blockGroup.data('snap', this.snap);
            blockGroup.data('isScaling', false);
            blockGroup.dblclick(turnOnscaleMode);
          },
          );
        this.blockType = null;
      }
    },
  },
};
</script>

<style scoped>
.editorSvg {
  border: 5px solid black;
  margin: 5px;
}
</style>
