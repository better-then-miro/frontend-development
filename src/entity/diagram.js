export default class Diagram {
  Id = null;
  name = '';
  description = '';
  Type = '';
  mode = '';
  blocks = [];
  links = [];
  supportedBlockTypes = []
  constructor(Id, name, description, Type, mode = 'free', blockTypes = null, blocks = [], links = []) {
    this.Id = Id;
    Object.defineProperty(this, 'Id', { writable: false }); // readonly ID
    this.name = name;
    this.description = description;
    this.Type = Type;
    this.mode = mode;
    this.blocks = blocks;
    this.links = links;
    if (blockTypes === null) {
      if (this.mode.toLowerCase() === 'free') {
        this.supportedBlockTypes = ['Class', 'Use-case', 'Actor'];
      } else if (this.Type.toLowerCase() === 'use-case') {
        this.supportedBlockTypes = ['Use-case', 'Actor'];
      } else if (this.Type.toLowerCase() === 'class') {
        this.supportedBlockTypes = ['Class'];
      }
    } else {
      this.supportedBlockTypes = blockTypes;
    }
  }
}
