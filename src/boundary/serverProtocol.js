// import Project from '../entity/project';
// import { dragMove, dragStart, dragStop } from './EditingPanel/drag';
// import Diagram from '../entity/diagram';
/* eslint-disable no-console */

const axios = require('axios');

// TODO server request: see "Server Protocol Boundary API"
export function loadDiagramsFromServer(pId) {
  return axios.get('http://127.0.0.1:5000/getDiagrams', { params: { Id: pId } })
    .then(response => response.data);
}

// eslint-disable-next-line no-unused-vars
export function loadProjectsFromServer() {
  // Example of request - use with Sandbox
  // eslint-disable-next-line no-param-reassign,no-return-assign
  return axios.get('http://127.0.0.1:5000/getProjectList')
    .then(response => response.data);
}

export function updateBlockProperties(properties) {
  console.log(properties);
  axios.post('http://127.0.0.1:5000/updateBlockProperties', properties)
    .then(response => console.log(response));
}

export function getDiagramContent(diagramId) {
  console.log(diagramId);
  return axios.get('http://127.0.0.1:5000/getDiagramContent', { params: { Id: diagramId } })
    .then(response => response.data);
}
