<template>
  <div>
    <input id="blockTitle" type="text" placeholder="Enter block title"
           name="blockTitle" v-model="blockTitle">
    <div>
      <input type="radio" id="contactChoice1"
             name="blockType" value="Class" v-model="blockType">
      <label for="contactChoice1">Class</label>
      <input type="radio" id="contactChoice2"
             name="blockType" value="Use-case" v-model="blockType">
      <label for="contactChoice2">Use-case</label>
    </div>
    <button type="button" class="btn icon-plus" v-on:click="addNewBlock()">
      Add new block
    </button>
  </div>
</template>

<script>
/* eslint-disable no-console */
export default {
  name: 'SidePanel',
  emits: {
    'create-block': { Type: String, title: String },
  },
  data() {
    return {
      blockTitle: '',
      blockType: null,
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
      }
    },
  },
};
</script>

<style scoped>

</style>
