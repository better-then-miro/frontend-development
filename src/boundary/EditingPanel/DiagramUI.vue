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
            if (block.Type === 'Class') {
              const newRect = this.snap.rect(
                block.coords[0], block.coords[1],
                block.width, block.height);
              newRect.data('Id', block.Id);
              newRect.data('Type', 'Class');
              newRect.data('Type', block.Type);
              newRect.drag(dragMove, dragStart, dragStop);
            } else if (block.Type === 'Use-case') {
              const newEllipse = this.snap.ellipse(
                block.coords[0], block.coords[1],
                // horizontal and vertical RADIUS -> width and height needed to be divided by two
                Math.round(block.width / 2), Math.round(block.height / 2));
              newEllipse.data('Id', block.Id);
              newEllipse.data('Type', block.Type);
              newEllipse.drag(dragMove, dragStart, dragStop);
            }
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
          width: 50,
          height: 50,
        };

        createNewBlock(properties)
          .then((blockId) => {
            // eslint-disable-next-line no-console
            console.log('New block id: ', blockId);
            if (properties.type === 'Class') {
              const newRect = this.snap.rect(
                properties.coords[0], properties.coords[1],
                properties.width, properties.height);
              newRect.data('Id', blockId);
              newRect.data('Type', properties.type);
              newRect.drag(dragMove, dragStart, dragStop);
            } else if (properties.type === 'Use-case') {
              const newEllipse = this.snap.ellipse(
                properties.coords[0], properties.coords[1],
                Math.round(properties.width / 2), Math.round(properties.height / 2));
              newEllipse.data('Id', blockId);
              newEllipse.data('Type', properties.type);
              newEllipse.drag(dragMove, dragStart, dragStop);
            }
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
