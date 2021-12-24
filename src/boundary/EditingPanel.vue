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
    <input id="selectedBlockTitle" ref="blockTitle"
        style="padding:15px; padding-top:5px; margin-bottom:5px; font-size:17px;"
        type="text" placeholder="Enter block title"
        name="blockTitle" :value=selectedBlockView.block.title>

    <h3 class="input-title"
        style="margin-top:5px; margin-bottom:5px;">
        Description:
    </h3>
    <input id="selectedBlockDescription" ref="blockDescription"
        style="padding:15px; padding-top:5px; margin-bottom:5px; font-size:17px;"
        type="text" placeholder="Enter block description"
        name="blockDescription" :value=selectedBlockView.block.description>

    <div ref="additionalFieldsSection">
      <div v-for="attributeKey in Object.keys(selectedBlockView.block.additionalFields)"
        v-bind:key="attributeKey">
        <div v-if="attributeKey=='Operations'||attributeKey=='Attributes'">
          <h3 class="input-title"
            style="margin-top:5px; margin-bottom:5px;">
            {{ attributeKey }}
          </h3>
          <ul class="additionalFieldList">
            <li v-for="attributeValue in selectedBlockView.block.additionalFields[attributeKey]"
              :key="attributeValue">
              <input class="additionalFieldItem" :id=attributeKey :value=attributeValue>
            </li>
          </ul>
          <button class="addNewAttributeValueBtn" role="button"
            v-on:click="addNewItem(attributeKey)">
            Add new item
          </button>
        </div>
        <div v-else>
          <div class="input-title">{{ attributeKey }}:</div>
          <input type="text" placeholder="Enter property value"
              :value=selectedBlockView.block.additionalFields[attributeKey]>
        </div>
      </div>
    </div>
    <button class="btn btn-1" v-on:click="apply">
      Apply Changes
    </button>
  </div>
</template>

<script>
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
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
    };
  },

  methods: {
    close() {
      this.$emit('close-panel');
    },

    apply(addNewItem = false) {
      const newAdditionFieldsDict = {};
      const oldKeys = Object.keys(this.selectedBlockView.block.additionalFields);
      for (const attributeKey in oldKeys) {
        newAdditionFieldsDict[oldKeys[attributeKey]] = [];
      }

      const additionalFieldInputs = this.$refs.additionalFieldsSection.querySelectorAll('input');

      additionalFieldInputs.forEach((fieldInput) => {
        if (fieldInput.id in newAdditionFieldsDict === false) {
          newAdditionFieldsDict[fieldInput.id] = [];
        }

        if (addNewItem || fieldInput.value !== '') {
          newAdditionFieldsDict[fieldInput.id].push(fieldInput.value);
        }
      });

      this.selectedBlockView.block.additionalFields = newAdditionFieldsDict;

      this.selectedBlockView.blockGroup[1].node.textContent = this.$refs.blockTitle.value;
      this.selectedBlockView.block.title = this.$refs.blockTitle.value;
      this.selectedBlockView.block.description = this.$refs.blockDescription.value;
      this.$emit('apply-changes');
    },

    addNewItem(itemType) {
      this.apply(true);
      let addingAllowed = true;
      const additionalFieldInputs = this.$refs.additionalFieldsSection.querySelectorAll('input');
      additionalFieldInputs.forEach((fieldInput) => {
        if (fieldInput.id === itemType && fieldInput.value === '') {
          addingAllowed = false;
        }
      });

      if (addingAllowed) {
        if (itemType in this.selectedBlockView.block.additionalFields === false) {
          this.selectedBlockView.block.additionalFields[itemType] = [];
        }
        this.selectedBlockView.block.additionalFields[itemType].push('');
      }
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
