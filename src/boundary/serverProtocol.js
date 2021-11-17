import Project from '../entity/project';
import { dragMove, dragStart, dragStop } from './EditingPanel/drag';
// import Diagram from '../entity/diagram';
/* eslint-disable no-console */
const axios = require('axios');

// TODO server request: see "Server Protocol Boundary API"
// eslint-disable-next-line no-unused-vars
export function loadDiagramsFromServer(pid) {
  return axios.get('http://127.0.0.1:5000/getDiagrams').then(response => response.data);
}

// eslint-disable-next-line no-unused-vars
// export function getDiagramContent(diagramID) {
//   return axios.get('http://127.0.0.1:5000/getDiagramContent').then(response => response.data);
// }

export function loadProjectsFromServer() {
  // Example of request - use with Sandbox
  axios.get('http://127.0.0.1:5000/example2').then(response => console.log(response));

  return [new Project(0, 'Project 1', 'Project description'),
    new Project(1, 'Smandoprochi', 'Better then tamagochi'),
    new Project(2, 'Diagrams', 'Use-case diagrams'),
    new Project(3, 'Bricky', '')];
}

export function updateBlockProperties(properties) {
  console.log(properties);
  axios.post('http://127.0.0.1:5000/updateBlockProperties', properties)
    .then(response => console.log(response));
}

export function getDiagramContent(snap) {
  axios.get('http://127.0.0.1:5000/getDiagramContent')
    .then((response) => {
      response.data.forEach((block) => {
        if (block.type === 'rect') {
          const newRect = snap.rect(block.x_left, block.y_top,
            block.width, block.height);
          newRect.data('id', block.blockID);
          newRect.drag(dragMove, dragStart, dragStop);
        } else if (block.type === 'circle') {
          const newEllipse = snap.ellipse(block.x_left, block.y_top,
            block.width, block.height);
          newEllipse.data('id', block.blockID);
          newEllipse.drag(dragMove, dragStart, dragStop);
        }
      });
    },
    );
}
