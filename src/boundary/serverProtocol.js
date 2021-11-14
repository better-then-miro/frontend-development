import Project from '../entity/project';
// import Diagram from '../entity/diagram';
/* eslint-disable no-console */
const axios = require('axios');

// TODO server request: see "Server Protocol Boundary API"
// eslint-disable-next-line no-unused-vars
export function loadDiagramsFromServer(pid) {
  // axios.get('/getDiagrams').then(response => console.log(response));
  return axios.get('/getDiagrams').then(response => response.data);
  // return [
  //   new Diagram(0, pid, 'Test Diagram 1', '', 'strict'),
  //   new Diagram(1, pid, 'Test Diagram 2', '', 'strict'),
  //   new Diagram(2, pid, 'Test Diagram 3', '', 'free'),
  //   new Diagram(3, pid, 'Test Diagram 4', '', 'strict'),
  //   new Diagram(4, pid, 'Test Diagram 5', '', 'free'),
  // ];
}

export function loadProjectsFromServer() {
  // Example of request - use with Sandbox
  axios.get('/example2').then(response => console.log(response));

  return [new Project(0, 'Project 1', 'Project description'),
    new Project(1, 'Smandoprochi', 'Better then tamagochi'),
    new Project(2, 'Diagrams', 'Use-case diagrams'),
    new Project(3, 'Bricky', '')];
}
