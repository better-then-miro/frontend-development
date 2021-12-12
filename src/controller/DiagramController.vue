<template>
  <div>
    <diagram-ui v-if="showDiagramWindow" v-bind:currentDiagram="this.currentDiagram"/>
    <!--  TODO add block boundary component  -->
  </div>
</template>

<script>
/* eslint-disable no-console */
import DiagramUi from '../boundary/DiagramUI/DiagramUI';
import { getDiagramContent } from '../boundary/serverProtocol';
import Block from '../entity/block';


export default {
  name: 'DiagramController',
  components: { DiagramUi },
  props: ['currentDiagram'],

  data() {
    return {
      showDiagramWindow: false,
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      getDiagramContent(this.currentDiagram.Id)
        .then((data) => {
          data.blocks.forEach((block) => {
            this.currentDiagram.blocks.push(new Block(block.Id, block.Type,
              block.coords[0], block.coords[1], block.width, block.height,
              block.title, block.description, block.additionalFields));
          });
        },
        ).then(() => {
          this.showDiagramWindow = true;
        });
    },

  },
};
</script>

<style scoped>

</style>
