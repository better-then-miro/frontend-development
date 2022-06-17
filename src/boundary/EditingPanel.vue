<template>
  <div>
    <div v-if="selectedBlockView!=null" class="editing-panel">
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
          style="padding-left:15px; padding-top:5px; margin-bottom:5px; font-size:17px;"
          type="text" placeholder="Enter block title"
          name="blockTitle" :value=selectedBlockView.block.title>

      <h3 class="input-title"
          style="margin-top:5px; margin-bottom:5px;">
          Description:
      </h3>
      <input id="selectedBlockDescription" ref="blockDescription"
          style="padding-left:15px; padding-top:5px; margin-bottom:5px; font-size:17px;"
          type="text" placeholder="Enter block description"
          name="blockDescription" :value=selectedBlockView.block.description>

      <div v-if="selectedBlockView.block.additionalFields">
        <div v-for="attributeKey in Object.keys(selectedBlockView.block.additionalFields)"
          v-bind:key="attributeKey">
          <div v-if="attributeKey=='stereotype'">
            <h3 class="input-title"
              style="margin-top:5px; margin-bottom:5px;">
              Stereotype
            </h3>
            <select ref="selectStereotype" v-model="selectedStereotype">
              <option>Boundary</option>
              <option>Control</option>
              <option>Entity</option>
              <option></option>
            </select>
          </div>
        </div>
      </div>

      <div ref="additionalFieldsSection" v-if="selectedBlockView.block.additionalFields">
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
                <div style="display:flex; flex-direction: row; align-items: center">
                  <input class="additionalFieldItem" :id=attributeKey :value=attributeValue>
                  <button class="deleteAttributeValueBtn" role="button"
                    v-on:click="deleteItem(attributeKey, attributeValue)">
                    X
                  </button>
                </div>
              </li>
            </ul>
            <button class="addNewAttributeValueBtn" role="button"
              v-on:click="addNewItem(attributeKey)">
              Add new item
            </button>
          </div>
          <div v-else-if="attributeKey!=='stereotype'">
            <div class="input-title">{{ attributeKey }}:</div>
            <input type="text" placeholder="Enter property value"
                :value=selectedBlockView.block.additionalFields[attributeKey]>
          </div>
        </div>
      </div>
      <button class="btn btn-1" style="margin-left: 20px" v-on:click="apply('')">
        Apply Changes
      </button>
      <button class="btn btn-1"
        style="margin-left: 20px; background: red; color: white" v-on:click="deleteBlock()">
        Delete block
      </button>
    </div>
    <div v-if="selectedLink!=null">
      <button class="btn btn-1"
        style="margin-left: 20px; background: red; color: white" v-on:click="deleteLink()">
        Delete link
      </button>
    </div>
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
    selectedLink: Object,
  },
  emits: {
    'close-panel': null,
    'apply-changes': {
      additionalFields: {},
      title: String,
      description: String,
    },
    'item-deleted': {},
    'delete-block': { blockToDelete: Object },
    'delete-link': Object,
  },

  data() {
    return {
      snap: null,
      selectedStereotype: '',
    };
  },

  mounted() {
    this.updateStereotypySelection();
  },

  updated() {
    this.updateStereotypySelection();
  },

  methods: {
    close() {
      this.$emit('close-panel');
    },

    updateStereotypySelection() {
      if (this.selectedBlockView.block.additionalFields) {
        if (this.selectedBlockView.block.additionalFields.stereotype) {
          const currentOption = this.selectedBlockView.block.additionalFields.stereotype;
          for (const option in Object.values(this.$refs.selectStereotype[0])) {
            if (this.$refs.selectStereotype[0][option] !== undefined) {
              if (this.$refs.selectStereotype[0][option].value === currentOption) {
                this.$refs.selectStereotype[0][option].selected = true;
              }
            }
          }
        }
      }
    },

    apply(newItemKey = '') {
      const newAdditionFieldsDict = {};
      if (this.selectedBlockView.block.additionalFields !== null) {
        const oldKeys = Object.keys(this.selectedBlockView.block.additionalFields);
        for (const attributeKey in oldKeys) {
          newAdditionFieldsDict[oldKeys[attributeKey]] = [];
        }

        const additionalFieldInputs = this.$refs.additionalFieldsSection.querySelectorAll('input');

        additionalFieldInputs.forEach((fieldInput) => {
          if (!(fieldInput.id in newAdditionFieldsDict)) {
            newAdditionFieldsDict[fieldInput.id] = [];
          }

          if (fieldInput.value !== '') {
            newAdditionFieldsDict[fieldInput.id].push(fieldInput.value);
          }
        });
        if (newItemKey !== '') { newAdditionFieldsDict[newItemKey].push('Value'); }

        if (this.selectedBlockView.block.additionalFields.stereotype != null) {
          newAdditionFieldsDict.stereotype = this.selectedStereotype;
        }
      }
      // TODO work with SVG should be only in DiagramUI
      // this.selectedBlockView.blockGroup[1].node.textContent = this.$refs.blockTitle.value;
      // if (sendChanges) {
      this.$emit('apply-changes', {
        additionalFields: newAdditionFieldsDict,
        title: this.$refs.blockTitle.value,
        description: this.$refs.blockDescription.value,
      });
      // }
    },

    addNewItem(itemType) {
      this.apply(itemType);
    },

    deleteItem(attributeKey, attributeValue) {
      const newAdditionFieldsDict = {};
      const additionalFieldInputs = this.$refs.additionalFieldsSection.querySelectorAll('input');
      additionalFieldInputs.forEach((fieldInput) => {
        if (fieldInput.id in newAdditionFieldsDict === false) {
          newAdditionFieldsDict[fieldInput.id] = [];
        }

        if (((fieldInput.id === attributeKey) && (fieldInput.value === attributeValue)) === false) {
          newAdditionFieldsDict[fieldInput.id].push(fieldInput.value);
        }
      });

      this.$emit('item-deleted', newAdditionFieldsDict);
    },

    deleteBlock() {
      this.$emit('delete-block', { blockToDelete: this.selectedBlockView });
    },

    deleteLink() {
      this.$emit('delete-link', this.selectedLink);
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
