<template>
  <div>
    <div class="navbar">
      <button class="btn btn-1" v-on:click="goHome()">
        Home
      </button>
      <h1 v-if="state==='project navigator'">Project navigator</h1>
      <h1 v-else-if="state==='diagram navigator'">Project "{{ currentProject.name }}"</h1>
      <h1 v-else-if="state==='diagram editor'">Diagram "{{ currentDiagram.name }}"</h1>
      <button class="btn btn-1 btn-sep icon-plus" v-if="state==='project navigator'"
              v-on:click="showCreateNewProjectDialog=true">
        Create new project
      </button>
      <button class="btn btn-1 btn-sep icon-plus" v-if="state==='diagram navigator'"
              v-on:click="showCreateNewDiagramDialog=true">
        Create new diagram
      </button>
    </div>
    <div class="projectTable" v-if="state==='project navigator'">
      <div class="column" v-for="project in projects" v-bind:key="project.id">
        <div class="card">
          <!--<img src={{ project.image }}>-->
          <p><b>Name:</b> {{ project.name }}</p>
          <p><b>Description:</b> {{ project.description }}</p>
        </div>
      </div>
    </div>

    <div class="projectTable" v-else-if="state==='diagram navigator'">
      <div class="column" v-for="diagram in diagrams" v-bind:key="diagram.id">
        <div class="card">
          <!--<img src={{ project.image }}>-->
          <p><b>Name:</b> {{ diagram.name }}</p>
          <p><b>Description:</b> {{ diagram.description }}</p>
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
            <button type="button" class="signupbtn" v-on:click="addProject()">Create</button>
          </div>
        </div>
      </form>
    </div>

    <div v-if="showCreateNewDiagramDialog" class="newProjectModal">
      <form class="newProjectModal-content">
        <div class="formHeader">
          <h1>Create new diagram</h1>
          <span v-on:click="showCreateNewDiagramDialog=false" class="closeForm"
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
            <button type="button" v-on:click="showCreateNewDiagramDialog=false"
                    class="cancelbtn">
              Cancel
            </button>
            <button type="button" class="signupbtn" v-on:click="addDiagram()">Create</button>
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
      projects: [{ id: 0, name: 'Project 1', description: 'Project description' },
        { id: 1, name: 'Smandoprochi', description: 'Better then tamagochi' },
        { id: 2, name: 'Diagrams', description: 'Use-case diagrams' },
        { id: 3, name: 'Bricky', description: '' }],
      diagrams: [],
      newName: '',
      newDescription: '',
      currentProject: null,
      currentDiagram: null,
      showCreateNewProjectDialog: false,
      showCreateNewDiagramDialog: false,
      state: 'project navigator',
    };
  },

  methods: {
    addProject() {
      // TODO: Creating project should be done by server... probably... (UID?)
      const newProject = {
        id: this.projects.length,
        name: this.newName,
        description: this.newDescription,
      };
      // Creating new list with new created project
      this.projects = [...this.projects, newProject];
      this.showCreateNewProjectDialog = false;
      this.currentProject = newProject;
      this.state = 'diagram navigator';
      this.newName = '';
      this.newDescription = '';
    },

    addDiagram() {
      const newDiagram = {
        id: this.projects.length,
        name: this.newName,
        description: this.newDescription,
      };
      this.diagrams = [...this.diagrams, newDiagram];
      this.showCreateNewDiagramDialog = false;
      this.currentDiagram = newDiagram;
      // this.state = 'diagram editor';
      this.newName = '';
      this.newDescription = '';
    },

    goHome() {
      this.state = 'project navigator';
      this.currentDiagram = null;
      this.currentProject = null;
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
