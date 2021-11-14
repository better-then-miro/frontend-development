export default class Project {
  id = null;
  name = '';
  description = '';
  constructor(id, name, description) {
    this.name = name;
    this.description = description;
    this.id = id;
  }
  // TODO do we need _prop with getters/setters ?
}
