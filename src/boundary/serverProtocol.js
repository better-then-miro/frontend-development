/* eslint-disable no-console */

import Diagram from '../entity/diagram';
import Project from '../entity/project';

const axios = require('axios');

export function loadDiagramsFromServer(pId) {
  const diagrams = [];
  axios.get('http://127.0.0.1:5000/getDiagrams', { params: { Id: pId } })
    .then((response) => {
      const data = response.data;
      data.forEach((diagram) => {
        diagrams.push(
          new Diagram(diagram.Id, diagram.name, diagram.description, diagram.Type),
        );
      });
    });
  return diagrams;
}

export function loadProjectsFromServer() {
  const projects = [];
  axios.get('http://127.0.0.1:5000/getProjectList')
    .then((response) => {
      const data = response.data;
      data.forEach((project) => {
        projects.push(new Project(project.Id, project.name, project.description));
      });
    });
  return projects;
}

export function updateBlockProperties(block) {
  const properties = {
    Id: block.Id,
    width: block.width,
    height: block.height,
    coords: block.coords,
    title: block.title,
    description: block.description,
  };

  console.log('Properties to update: ', properties);
  axios.post('http://127.0.0.1:5000/updateBlockProperties', properties)
    .then(response => console.log(response));
}

export function getDiagramContent(diagramId) {
  console.log('Fetch content of diagram: ', diagramId);
  return axios.get('http://127.0.0.1:5000/getDiagramContent', { params: { Id: diagramId } })
    .then(response => response.data);
}

export function createNewBlock(properties) {
  console.log('New block properties: ', properties);
  return axios.post('http://127.0.0.1:5000/createNewBlock', properties)
    .then(response => response.data.bId);
}

export function createNewLink(properties) {
  console.log('New link properties: ', properties);
  return axios.post('http://127.0.0.1:5000/createNewLink', properties)
    .then(response => response.data.lId);
}
