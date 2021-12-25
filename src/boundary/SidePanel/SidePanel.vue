<template>
  <div>
    <input id="blockTitle" type="text" placeholder="Enter block title"
           name="blockTitle" v-model="blockTitle">
    <div class="selection-grid" style="display:flex; flex-direction: row;">
      <selection-entry v-for="type in supportedBlockTypes"
                       v-bind:block-type="type"
                       v-bind:selected-entry="blockType"
                       v-on:entry-selected="changeSelected"
                       v-bind:key="type"/>
      <button type="button" class="btn icon-plus sidePanelBtn" v-on:click="addNewBlock()">
        Add new block
      </button>
    </div>
    <!--<div style="display:flex; flex-direction: row;
      justify-content: space-around; align-items: center">
      <div style="margin: 5px">
        <input type="radio" id="blockChoice1"
              name="blockType" value="Class" v-model="blockType">
        <label for="blockChoice1">Class</label>
      </div>
      <div style="margin: 5px">
        <input type="radio" id="blockChoice2"
              name="blockType" value="Use-case" v-model="blockType">
        <label for="blockChoice2">Use-case</label>
      </div>
      <button type="button" class="btn icon-plus sidePanelBtn" v-on:click="addNewBlock()">
        Add new block
      </button>
    </div>-->

    <div style="display:flex; flex-direction: column;
      justify-content: space-around; align-items: center">
      <div style="display:flex; flex-direction: row;
        justify-content: space-around; align-items: center">
        <div style="margin: 5px">
          <input type="radio" id="linkChoice1"
                name="linkType" value="Association" v-model="linkType">
          <label for="linkChoice1">Association</label>
        </div>
        <div style="margin: 5px">
          <input type="radio" id="linkChoice2"
                name="linkType" value="Association(Bidirectional)" v-model="linkType">
          <label for="linkChoice2">Association(Bidirectional)</label>
        </div>
        <div style="margin: 5px">
          <input type="radio" id="linkChoice3"
                name="linkType" value="Dependency" v-model="linkType">
          <label for="linkChoice3">Dependency</label>
        </div>
        <button type="button" class="btn icon-plus sidePanelBtn" v-on:click="toggleLinkMode()">
          Toggle link mode
        </button>
      </div>
      <h3 v-if="isLinkAddMode" style="margin: 5px">Link mode</h3>
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
  },
  emits: {
    'toggle-link-mode': { bool: Boolean },
    'add-new-link': { linkType: String },
    'create-block': { Type: String, title: String },
  },
  data() {
    return {
      blockTitle: '',
      blockType: null,
      linkType: null,
      supportedBlockTypes: ['Class', 'Use-case', 'Actor'],
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
        this.blockTitle = '';
        this.blockType = null;
      }
    },

    toggleLinkMode() {
      this.$emit('toggle-link-mode', { bool: !this.isLinkAddMode });
    },

    addNewLink() {
      this.$emit('add-new-link', { linkType: this.linkType });
      this.linkType = null;
    },

    changeSelected(sel) {
      this.blockType = sel;
    },
  },
};
</script>

<style scoped>

</style>
