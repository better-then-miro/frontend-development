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
        <div class="card" v-on:click="openProject(project)">
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
          <p><b>Type:</b> {{ diagram.type }}</p>
        </div>
      </div>
    </div>

    <div v-if="showCreateNewProjectDialog" id="id01" class="newProjectModal">
      <!-- TODO: form @submit handling -->
      <form class="newProjectModal-content">
        <div class="formHeader">
          <h1>Create new project</h1>
          <span v-on:click="showCreateNewProjectDialog=false" class="closeForm"
                title="Close form">X</span>
        </div>
        <hr>
        <div class="newProjectForm">
          <label for="NameProj"><b>Name</b></label>
          <input id="NameProj" type="text" placeholder="Enter project name"
                 name="name" required v-model="newName">

          <label for="DescriptionProj"><b>Description</b></label>
          <input id="DescriptionProj" type="text" placeholder="Enter project description"
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
          <input id="Name" type="text" placeholder="Enter diagram name"
                 name="name" v-model="newName" required>

          <label for="Description"><b>Description</b></label>
          <input id="Description" type="text" placeholder="Enter diagram description"
                 name="description" v-model="newDescription">
          <label><b>Diagram Type</b></label>
          <select>
            <option>strict</option>
            <option>free</option>
          </select>
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
// import Project from './entity/project';
import { loadDiagramsFromServer, loadProjectsFromServer } from './boundary/serverProtocol';

export default {
  name: 'App',
  data() {
    return {
      projects: [],
      diagrams: [],
      newName: '',
      newDescription: '',
      newDiagramType: '',
      currentProject: null,
      currentDiagram: null,
      showCreateNewProjectDialog: false,
      showCreateNewDiagramDialog: false,
      state: 'project navigator',
    };
  },

  mounted() {
    this.projects = loadProjectsFromServer();
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
      this.showProject(newProject);
    },

    openProject(project) {
      this.showProject(project);
      this.diagrams = loadDiagramsFromServer(project.id);
    },

    showProject(project) {
      this.currentProject = project;
      this.state = 'diagram navigator';
      this.newName = '';
      this.newDescription = '';
    },

    addDiagram() {
      const newDiagram = {
        id: this.projects.length,
        projID: this.currentProject.id,
        name: this.newName,
        description: this.newDescription,
        type: this.newDiagramType,
      };
      this.diagrams = [...this.diagrams, newDiagram];
      this.showCreateNewDiagramDialog = false;
      this.showDiagram(newDiagram);
    },

    showDiagram(diagram) {
      this.currentDiagram = diagram;
      this.state = 'diagram editor';
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
