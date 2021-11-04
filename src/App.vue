<template>
  <div>
    <div class="navbar">
      <h1>Project navigator</h1>
      <button class="btn btn-1 btn-sep icon-plus"
              onclick="document.getElementById('id01').style.display='block'">
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

    <div id="id01" class="newProjectModal">
      <form class="newProjectModal-content">
        <div class="formHeader">
          <h1>Create new project</h1>
          <span onclick="document.getElementById('id01').style.display='none'" class="closeForm"
                title="Close form">X</span>
        </div>
        <hr>
        <div class="newProjectForm">
          <label for="Name"><b>Name</b></label>
          <input type="text" placeholder="Enter project name" name="name" required>

          <label for="Description"><b>Description</b></label>
          <input type="text" placeholder="Enter project description" name="description">

          <div class="newProjectButtons">
            <button type="button" onclick="document.getElementById('id01').style.display='none'"
                    class="cancelbtn">
              Cancel
            </button>
            <button type="submit" class="signupbtn">Sign Up</button>
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
    };
  },
};
</script>

<style>
@import "static/projectList.css";
</style>
