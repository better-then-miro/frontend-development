<template>
  <svg id="mySvg" class="editorSvg" width="500" height="500"></svg>
</template>

<script>
import Snap from 'snapsvg-cjs';
import { getDiagramContent } from '../serverProtocol';
import { setBounds } from './drag';


export default {
  name: 'EditingPanel',
  data() {
    return {
      snap: null,
      radius: 15,
      myCircle: null,
    };
  },

  mounted() {
    this.snap = Snap('#mySvg');
    this.init();
  },
  watch: {
    radius() {
      this.myCircle.attr({ r: this.radius });
    },
  },

  methods: {
    init() {
      setBounds(10, 10, 510, 510);
      this.snap.attr({ viewBox: '0 0 500 500' });
      getDiagramContent(this.snap);
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
