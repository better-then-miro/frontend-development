<template>
  <div class="editing-panel" >
    <div class="panel-header">
      <h2>Block modification</h2>
      <span v-on:click="close" class="closeForm"
            title="Close panel">X</span>
    </div>
    <div class="input-title">Name:</div>
    <input id="selectedBlockTitle" type="text" placeholder="Enter block title"
           name="blockTitle" v-model="blockTitle">
    <div class="input-title">Description:</div>
    <input id="selectedBlockDescription" type="text" placeholder="Enter block description"
           name="blockDescription" v-model="blockDescription">
    <button class="btn btn-1" v-on:click="apply">
      Apply Changes
    </button>
  </div>
</template>

<script>
/* eslint-disable no-console */
import blockView from '../entity/blockView';

export default {
  name: 'EditingPanel',
  props: {
    selectedBlockView: blockView,
  },
  emits: {
    'close-panel': null,
    'apply-changes': { title: String, description: String },
  },

  data() {
    return {
      snap: null,
      blockTitle: '',
      blockDescription: '',
    };
  },

  mounted() {
    this.blockTitle = this.selectedBlockView.block.title;
    this.blockDescription = this.selectedBlockView.block.description;
  },

  methods: {
    close() {
      this.$emit('close-panel');
    },

    apply() {
      // this.selectedBlockView.block.title = this.blockTitle;
      this.selectedBlockView.blockGroup[1].node.textContent = this.blockTitle;
      // this.selectedBlockView.block.description = this.blockDescription;
      // TODO server save
      this.$emit('apply-changes', { title: this.blockTitle, description: this.blockDescription });
    },
  },

  watch: {
    selectedBlockEntity() {
      this.blockTitle = this.selectedBlockEntity.title;
      this.blockDescription = this.selectedBlockEntity.description;
    },
  },
};
</script>

<style scoped>
.editing-panel {
  padding: 1px;
  text-align: left;
  background-color: #f1f1f1;
  margin-bottom: 30px;
  margin-top: 30px;
}

.input-title {
  padding-left: 15px;
}

.panel-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 10px;
}

</style>
