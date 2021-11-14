export default class Diagram {
  diagramID = null;
  projectID = null;
  name = '';
  description = '';
  type = '';
  constructor(diagramID, projectID, name, description, type) {
    this.diagramID = diagramID;
    this.projectID = projectID;
    this.name = name;
    this.description = description;
    this.type = type;
  }
}
