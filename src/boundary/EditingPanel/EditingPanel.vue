<template>
  <svg id="mySvg" class="editorSvg" width="500" height="500"></svg>
</template>

<script>
import Snap from 'snapsvg-cjs';
import { dragMove, dragStart, dragStop, setBounds } from './drag';

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
      const rect = this.snap.rect(20, 20, 40, 40);
      const circle = this.snap.circle(60, 150, 50);
      rect.drag(dragMove, dragStart, dragStop);
      circle.drag(dragMove, dragStart, dragStop);
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
