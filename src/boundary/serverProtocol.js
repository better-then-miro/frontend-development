/* eslint-disable no-console */

import openSocket from 'socket.io-client';
import Diagram from '../entity/diagram';
import Project from '../entity/project';

const ServerUrl = 'http://127.0.0.1:5000/';
const axios = require('axios');

let socket;
export function initSocketIo() {
  socket = openSocket(`${ServerUrl}main`);
}

export function loadDiagramsFromServer(pId) {
  const diagrams = [];
  axios.get(`${ServerUrl}getDiagrams`, { params: { Id: pId } })
    .then((response) => {
      const data = response.data;
      data.forEach((diagram) => {
        diagrams.push(
          // TODO mode support on server side
          new Diagram(diagram.Id, diagram.name, diagram.description, diagram.Type, diagram.mode),
        );
      });
    });
  return diagrams;
}

export function loadProjectsFromServer() {
  const projects = [];
  axios.get(`${ServerUrl}getProjectList`)
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
    additionalFields: block.additionalFields,
  };

  console.log('Properties to update: ', properties);
  axios.post(`${ServerUrl}updateBlockProperties`, properties)
    .then(response => console.log(response));
}

export function getDiagramContent(diagramId, callback) {
  console.log('Requesting content of diagram: ', diagramId);
  socket.emit('getDiagramContent', { Id: diagramId });
  socket.on('getDiagramContentHandler', callback);
}

export function createNewProject(properties) {
  return axios.post(`${ServerUrl}createNewProject`, properties)
    .then(response => response.data.pId);
}

export function createNewDiagram(properties) {
  console.log('New diagram properties: ', properties);
  return axios.post(`${ServerUrl}createNewDiagram`, properties)
    .then(response => response.data.dId);
}

export function createNewBlock(properties) {
  console.log('New block properties: ', properties);
  return axios.post(`${ServerUrl}/createNewBlock`, properties)
    .then(response => response.data.bId);
}

export function createNewLink(properties) {
  console.log('New link properties: ', properties);
  return axios.post(`${ServerUrl}createNewLink`, properties)
    .then(response => response.data.lId);
}

export function deleteLink(linkId) {
  console.log('Deleting link: ', linkId);
  return axios.get(`${ServerUrl}/deleteLink`, { params: { Id: linkId } })
    .then(response => response.data.lId);
}

export function deleteBlock(blockId) {
  console.log('Deleting block: ', blockId);
  return axios.get(`${ServerUrl}deleteBlock`, { params: { Id: blockId } })
    .then(response => response.data.lId);
}
