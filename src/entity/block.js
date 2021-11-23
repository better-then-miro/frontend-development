export default class Block {
  Id = null;
  Type = '';
  coords = [null, null];
  width = null;
  heigth = null;
  // TODO additional fields. For example name and description
  constructor(Id, Type, x, y, width, heigth) {
    this.Id = Id;
    Object.defineProperty(this, 'Id', { writable: false }); // readonly ID
    this.Type = Type;
    this.coords = [x, y];
    this.width = width;
    this.heigth = heigth;
    this.name = name;
  }
}
