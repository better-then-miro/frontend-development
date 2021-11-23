export default class Diagram {
  Id = null;
  name = '';
  description = '';
  Type = '';
  blocks = [];
  links = [];
  constructor(Id, name, description, Type, blocks = [], links = []) {
    this.Id = Id;
    Object.defineProperty(this, 'Id', { writable: false }); // readonly ID
    this.name = name;
    this.description = description;
    this.Type = Type;
    this.blocks = blocks;
    this.links = links;
  }
}
