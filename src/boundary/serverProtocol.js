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

export function updateBlockTextProperties(block) {
  const properties = {
    Id: block.Id,
    title: block.title,
    description: block.description,
    additionalFields: block.additionalFields,
  };
  console.log('Text properties to update: ', properties);
  // Handler just to check if error occurred
  socket.on('updateBlockPropertiesHandler', (response) => {
    if (response.code !== 200) {
      console.log('Error occurred when updating properties, error code: ', response.code);
    }
  });
  socket.emit('updateBlockProperties', properties);
}

export function updateBlockPositionProperties(block) {
  const properties = {
    Id: block.Id,
    width: block.width,
    height: block.height,
    coords: block.coords,
  };
  console.log('Position properties to update: ', properties);
  // Handler just to check if error occurred
  socket.on('updateBlockPropertiesHandler', (response) => {
    if (response.code !== 200) {
      console.log('Error occurred when updating properties, error code: ', response.code);
    }
  });
  socket.emit('updateBlockProperties', properties);
}

export function updateBlockAdditionalProperties(block) {
  const properties = {
    Id: block.Id,
    additionalFields: block.additionalFields,
  };
  console.log('Additional properties to update: ', properties);
  // Handler just to check if error occurred
  socket.on('updateBlockPropertiesHandler', (response) => {
    if (response.code !== 200) {
      console.log('Error occurred when updating properties, error code: ', response.code);
    }
  });
  socket.emit('updateBlockProperties', properties);
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

export async function createNewBlock(properties, addNewBlockHandler) {
  console.log('New block properties: ', properties);

  socket.on('createNewBlockHandler', (response) => {
    if (response.code === 200) {
      addNewBlockHandler(response.bId);
    } else {
      console.log('Error occurred when creating block, error code: ', response.code);
    }
  });
  socket.emit('createNewBlock', properties);
}

export function createNewLink(properties, addNewLinkCallback) {
  console.log('New link properties: ', properties);
  socket.on('createNewLinkHandler', (response) => {
    if (response.code === 200) {
      addNewLinkCallback(response.lId);
    } else {
      console.log('Error occurred when creating link, error code: ', response.code);
    }
  });
  socket.emit('createNewLink', properties);
}

export function deleteLink(linkId) {
  console.log('Deleting link: ', linkId);
  socket.on('deleteLinkHandler', (response) => {
    if (response.code !== 200) {
      console.log('Error occurred when deleting link, error code: ', response.code);
    }
  });
  socket.emit('deleteLink', { Id: linkId });
}

export function deleteBlock(blockId) {
  console.log('Deleting block: ', blockId);
  socket.on('deleteBlockHandler', (response) => {
    if (response.code !== 200) {
      console.log('Error occurred when deleting block, error code: ', response.code);
    }
  });
  socket.emit('deleteBlock', { Id: blockId });
}
