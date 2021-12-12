<template>
  <div>
    <input id="blockTitle" type="text" placeholder="Enter block title"
           name="blockTitle" v-model="blockTitle">
    <div style="display:flex; flex-direction: row;
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
    </div>

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
                name="linkType" value="Include" v-model="linkType">
          <label for="linkChoice2">Include</label>
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
export default {
  name: 'SidePanel',
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
  },
};
</script>

<style scoped>

</style>
