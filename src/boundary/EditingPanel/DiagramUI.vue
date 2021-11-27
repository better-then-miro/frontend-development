<template>
  <svg id="mySvg" class="editorSvg" width="500" height="500"></svg>
</template>

<script>
import Snap from 'snapsvg-cjs';
import { dragMove, dragStart, dragStop, setBounds } from './drag';
import { getDiagramContent } from '../serverProtocol';


export default {
  name: 'EditingPanel',
  props: ['currentDiagram'],
  data() {
    return {
      snap: null,
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
      // eslint-disable-next-line no-console
      console.log('Current diagram: ', this.currentDiagram);
      getDiagramContent(this.currentDiagram.Id)
        .then((data) => {
          data.blocks.forEach((block) => {
            // eslint-disable-next-line no-console
            console.log('Block from getDiagramContent: ', block);
            if (block.Type === 'Std') {
              const newRect = this.snap.rect(
                block.coords[0], block.coords[0],
                block.width, block.height);
              newRect.data('id', block.Id);
              newRect.drag(dragMove, dragStart, dragStop);
            } else if (block.Type === 'circle') {
              const newEllipse = this.snap.ellipse(
                block.coords[0], block.coords[1],
                // horizontal and vertical RADIUS -> width and height needed to be divided by two
                Math.round(block.width / 2), Math.round(block.height / 2));
              newEllipse.data('id', block.Id);
              newEllipse.drag(dragMove, dragStart, dragStop);
            }
          });
        },
        );
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
