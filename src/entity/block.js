export default class Block {
  Id = null;
  Type = '';
  coords = [null, null];
  width = null;
  height = null;
  // TODO additional fields. For example name and description
  constructor(Id, Type, x, y, width, height) {
    this.Id = Id;
    Object.defineProperty(this, 'Id', { writable: false }); // readonly ID
    this.Type = Type;
    this.coords = [x, y];
    this.width = width;
    this.height = height;
    this.name = name;
  }
}
