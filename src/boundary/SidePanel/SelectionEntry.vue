<template>
  <div class="selection-entry" style="display:flex; flex-direction: column;"
        @click="select"
        v-bind:class="{ selected : isSelected }">
    <svg v-if="isBlock" :id="'svgID_' + objectType" class="blockSvg" height="60" width="60"></svg>
    {{ objectType }}
  </div>
</template>

<script>
import Snap from 'snapsvg-cjs';
import SvgBlockFactory from '../SnapUtils/svgBlockFactory';

export default {
  name: 'SelectionEntry',
  props: {
    objectType: String,
    isBlock: Boolean,
    selectedEntry: String,
  },
  emits: {
    'entry-selected': null,
  },

  data() {
    return {
      snap: null,
      factory: null,
      // isSelected: false,
    };
  },

  mounted() {
    if (this.isBlock) {
      this.snap = Snap(`#svgID_${this.objectType}`);
      this.snap.attr({ viewBox: '0 0 80 80' });
      this.factory = new SvgBlockFactory(this.snap);
      this.factory.svgCreate_byType(this.objectType, 0, 0, 80, 80);
    }
  },

  methods: {
    select() {
      // eslint-disable-next-line no-console
      console.log('Entry selected: ', this.objectType);
      this.$emit('entry-selected', { objectType: this.objectType, isBlock: this.isBlock });
    },
  },

  computed: {
    isSelected() {
      return this.objectType === this.selectedEntry;
    },
  },

};
</script>

<style scoped>
.selection-entry{
  margin: 2px;
}
.blockSvg{
  margin: 4px;
}
.selection-entry:hover{
  background-color: #dddddd;
}

.selected {
  background-color: #dddddd;
}
</style>
