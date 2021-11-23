export default class Project {
  Id = null;
  name = '';
  description = '';
  diagrams = [];
  constructor(Id, name, description, diagrams = []) {
    this.name = name;
    this.description = description;
    this.Id = Id;
    Object.defineProperty(this, 'Id', { writable: false }); // readonly ID
    this.diagrams = diagrams;
  }
  // TODO do we need _prop with getters/setters ?
}
