export default class Diagram {
  Id = null;
  name = '';
  description = '';
  Type = '';
  mode = '';
  blocks = [];
  links = [];
  constructor(Id, name, description, Type, mode = 'free', blocks = [], links = []) {
    this.Id = Id;
    Object.defineProperty(this, 'Id', { writable: false }); // readonly ID
    this.name = name;
    this.description = description;
    this.Type = Type;
    this.mode = mode;
    this.blocks = blocks;
    this.links = links;
  }
}
