<template>
  <div>
    <div class="navbar">
      <h1>Project navigator</h1>
      <button class="btn btn-1 btn-sep icon-plus"
              v-on:click="showCreateNewProjectDialog=true">
        Create new project
      </button>
    </div>
    <div class="projectTable">
      <div class="column" v-for="project in projects" v-bind:key="project.name">
        <div class="card">
          <!--<img src={{ project.image }}>-->
          <p><b>Name:</b> {{ project.name }}</p>
          <p><b>Description:</b> {{ project.description }}</p>
        </div>
      </div>
    </div>

    <div v-if="showCreateNewProjectDialog" id="id01" class="newProjectModal">
      <form class="newProjectModal-content">
        <div class="formHeader">
          <h1>Create new project</h1>
          <span v-on:click="showCreateNewProjectDialog=false" class="closeForm"
                title="Close form">X</span>
        </div>
        <hr>
        <div class="newProjectForm">
          <label for="Name"><b>Name</b></label>
          <input type="text" placeholder="Enter project name"
                 name="name" required v-model="newName">

          <label for="Description"><b>Description</b></label>
          <input type="text" placeholder="Enter project description"
                 name="description" v-model="newDescription">

          <div class="newProjectButtons">
            <button type="button" v-on:click="showCreateNewProjectDialog=false"
                    class="cancelbtn">
              Cancel
            </button>
            <button type="submit" class="signupbtn" v-on:click="addProject()">Create</button>
          </div>
        </div>
      </form>
    </div>
  </div>

</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      projects: [{ name: 'Project 1', description: 'Project description' },
        { name: 'Smandoprochi', description: 'Better then tamagochi' },
        { name: 'Diagrams', description: 'Use-case diagrams' },
        { name: 'Bricky', description: '' }],
      newName: '',
      newDescription: '',
      currentProject: null,
      showCreateNewProjectDialog: false,
    };
  },

  methods: {
    addProject() {
      // Creating new list with new created project
      this.projects = [...this.projects, { name: this.newName, description: this.newDescription }];
      this.showCreateNewProjectDialog = false;
    },
  },

  watch: {
    showCreateNewProjectDialog() {
      // eslint-disable-next-line no-console
      console.log(this.showCreateNewProjectDialog);
    },
  },
};
</script>

<style>
@import "static/projectList.css";
</style>
