<template>
  <div class="editing-panel" >
    <div class="panel-header">
      <h2>Block modification</h2>
      <span v-on:click="close" class="closeForm"
            title="Close panel">X</span>
    </div>

    <h3 class="input-title"
        style="margin-top:5px; margin-bottom:5px;">
        Name:
    </h3>
    <input id="selectedBlockTitle"
        style="padding:15px; padding-top:5px; margin-bottom:5px; font-size:17px;"
        type="text" placeholder="Enter block title"
        name="blockTitle" v-model="blockTitle">

    <h3 class="input-title"
        style="margin-top:5px; margin-bottom:5px;">
        Description:
    </h3>
    <input id="selectedBlockDescription"
        style="padding:15px; padding-top:5px; margin-bottom:5px; font-size:17px;"
        type="text" placeholder="Enter block description"
        name="blockDescription" v-model="blockDescription">

    <div v-for="attributeKey in Object.keys(selectedBlockView.block.additionalFields)"
      v-bind:key="attributeKey">
      <div v-if="attributeKey=='Operations'||attributeKey=='Attributes'">
        <div class="input-title">{{ attributeKey }}:</div>
        <ul>
          <li v-for="method in selectedBlockView.block.additionalFields[attributeKey]"
            :key="method">
            {{ method }}
          </li>
        </ul>
      </div>
      <div v-else>
        <div class="input-title">{{ attributeKey }}:</div>
        <input type="text" placeholder="Enter property value"
            :ref=attributeKey :value=selectedBlockView.block.additionalFields[attributeKey]>
      </div>
    </div>

    <button class="btn btn-1" v-on:click="apply">
      Apply Changes
    </button>
  </div>
</template>

<script>
/* eslint-disable no-console */
import blockView from './SnapUtils/blockView';

export default {
  name: 'EditingPanel',
  props: {
    selectedBlockView: blockView,
  },
  emits: {
    'close-panel': null,
    'apply-changes': {},
  },

  data() {
    return {
      snap: null,
      blockTitle: '',
      blockDescription: '',
    };
  },

  mounted() {
    this.changeSelected();
  },

  methods: {
    close() {
      this.$emit('close-panel');
    },

    apply() {
      // for (const attributeKey of Object.keys(selectedBlockView.block.additionalFields)) {
      //   // eslint-disable-next-line dot-notation
      //   if (this.$refs['testField'].length === 1) {
      //     // eslint-disable-next-line dot-notation
      //     console.log(this.$refs['testField'][0].value);
      //   }
      // }

      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(this.selectedBlockView.block.additionalFields)) {
        console.log(key, value);
      }
      this.selectedBlockView.blockGroup[1].node.textContent = this.blockTitle;
      this.$emit('apply-changes', { title: this.blockTitle, description: this.blockDescription });
    },

    changeSelected() {
      this.blockTitle = this.selectedBlockView.block.title;
      this.blockDescription = this.selectedBlockView.block.description;
    },
  },

  watch: {
    selectedBlockView() {
      this.changeSelected();
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
