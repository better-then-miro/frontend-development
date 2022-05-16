<template>
  <div>
    <input id="blockTitle" type="text" placeholder="Enter block title"
           name="blockTitle" v-model="blockTitle">
    <div class="selection-grid" style="display:flex; flex-direction: row;">
      <selection-entry v-for="type in supportedBlockTypes"
                       v-bind:object-type="type"
                       v-bind:is-block="true"
                       v-bind:selected-entry="blockType"
                       v-on:entry-selected="changeSelected"
                       v-bind:key="type"/>
      <button type="button" class="btn icon-plus sidePanelBtn" v-on:click="addNewBlock()">
        Add new block
      </button>
    </div>

    <div class="selection-grid" style="display:flex; flex-direction: row;">
      <selection-entry v-for="type in supportedLinkTypes"
                       v-bind:object-type="type"
                       v-bind:is-block="false"
                       v-bind:selected-entry="linkType"
                       v-on:entry-selected="changeSelected"
                       v-bind:key="type"/>
      <h3 v-if="isLinkAddMode" style="margin: 5px">Link mode</h3>
      <button type="button" class="btn icon-plus sidePanelBtn" v-on:click="toggleLinkMode()">
        Toggle link mode
      </button>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import SelectionEntry from './SelectionEntry';

export default {
  name: 'SidePanel',
  components: { SelectionEntry },
  props: {
    isLinkAddMode: Boolean,
    supportedBlockTypes: Array,
    supportedLinkTypes: Array,
  },
  emits: {
    'toggle-link-mode': { bool: Boolean },
    'create-block': { Type: String, title: String },
  },
  data() {
    return {
      blockTitle: '',
      blockType: null,
      linkType: null,
    };
  },

  methods: {
    addNewBlock() {
      // TODO: Find a better way to handle blocks with an empty title
      // TODO: (or a title that only contains spaces)
      if (this.blockType != null) {
        let newTitle;
        if (this.blockTitle.replaceAll(' ', '') === '') {
          newTitle = this.blockType;
        } else {
          newTitle = this.blockTitle;
        }
        this.$emit('create-block', { Type: this.blockType, title: newTitle });
        this.clear();
      }
    },

    toggleLinkMode() {
      this.$emit('toggle-link-mode', { bool: !this.isLinkAddMode });
    },

    clear() {
      this.blockTitle = '';
      this.blockType = null;
      this.linkType = null;
    },

    changeSelected(params) {
      if (params.isBlock) {
        this.blockType = params.objectType;
      } else {
        this.linkType = params.objectType;
      }
    },
  },
};
</script>

<style scoped>

</style>
