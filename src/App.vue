

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
      <div class="column" v-for="project in projects" v-bind:key="project.Id">
        <div class="card" v-on:click="openProject(project)">
          <p><b>Name:</b> {{ project.name }}</p>
          <p><b>Description:</b> {{ project.description }}</p>
        </div>
      </div>
    </div>

    <div class="projectTable" v-else-if="state==='diagram navigator'">
      <div class="column" v-for="diagram in currentProject.diagrams" v-bind:key="diagram.Id">
        <div class="card" @click="openDiagram(diagram)">
          <p><b>Name:</b> {{ diagram.name }}</p>
          <p><b>Description:</b> {{ diagram.description }}</p>
          <p><b>Type:</b> {{ diagram.Type }} diagram</p>
          <p><b>Mode:</b> {{ diagram.mode }}</p>
        </div>
      </div>
    </div>

    <div class="diagramEditor" v-else-if="state==='diagram editor'">
      <diagram-controller v-bind:current-diagram="currentDiagram"/>
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
          <div style="display:flex; flex-direction: row; margin-top: 20px">
            <div>
              <label><b>Diagram mode</b></label>
              <select v-model="newDiagramMode">
                <option>Strict</option>
                <option>Free</option>
              </select>
            </div>
            <div>
              <label><b>Diagram type</b></label>
              <select v-model="newDiagramType">
                <option>Use-case</option>
                <option>Class</option>
              </select>
            </div>
          </div>
          <div class="newProjectButtons">
            <button type="button" v-on:click="showCreateNewDiagramDialog=false" class="cancelbtn">
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
/* eslint-disable no-console */
import DiagramController from './controller/DiagramController';
import {
  createNewDiagram,
  createNewProject,
  loadDiagramsFromServer,
  loadProjectsFromServer,
} from './boundary/serverProtocol';
import Project from './entity/project';
import Diagram from './entity/diagram';

export default {
  name: 'App',
  components: {
    'diagram-controller': DiagramController,
  },
  data() {
    return {
      projects: [],
      newName: '',
      newDescription: '',
      newDiagramType: 'Use-case',
      newDiagramMode: 'Free',
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
      const properties = {
        name: this.newName,
        description: this.newDescription,
      };
      createNewProject(properties).then((pId) => {
        console.log('New project ID:', pId);
        const newProject = new Project(pId, this.newName, this.newDescription);
        this.projects = [...this.projects, newProject];
        this.showCreateNewProjectDialog = false;
        this.showProject(newProject);
      });
    },

    openProject(project) {
      this.showProject(project);
      this.currentProject.diagrams = loadDiagramsFromServer(project.Id);
    },

    showProject(project) {
      this.currentProject = project;
      this.state = 'diagram navigator';
      this.newName = '';
      this.newDescription = '';
    },

    addDiagram() {
      // TODO: Creating of diagram request to server
      const properties = {
        pId: this.currentProject.Id,
        name: this.newName,
        description: this.newDescription,
        Type: this.newDiagramType,
        mode: this.newDiagramMode,
      };
      createNewDiagram(properties).then((dId) => {
        const newDiagram = new Diagram(
          dId,
          this.newName,
          this.newDescription,
          this.newDiagramType,
          this.newDiagramMode,
        );
        this.currentProject.diagrams = [...this.currentProject.diagrams, newDiagram];
        this.showCreateNewDiagramDialog = false;
        this.showDiagram(newDiagram);
      });
    },

    openDiagram(diagram) {
      this.showDiagram(diagram);
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

    clear() {
      this.newName = '';
      this.newDescription = '';
      this.newDiagramType = 'use-case';
      this.newDiagramMode = 'free';
    },
  },
};
</script>

<style>
@import "static/projectList.css";
</style>
