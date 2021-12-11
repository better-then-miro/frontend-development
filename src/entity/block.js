export default class Block {
  Id = null;
  Type = '';
  coords = [null, null];
  width = null;
  height = null;
  title = '';
  description = '';
  constructor(Id, Type, x, y, width, height, title = `Default name ${Id}`, description = '') {
    this.Id = Id;
    Object.defineProperty(this, 'Id', { writable: false }); // readonly ID
    this.Type = Type;
    this.coords = [x, y];
    this.width = width;
    this.height = height;
    this.title = title;
    this.description = description;
  }

  setCoords(coords) {
    this.coords = coords;
  }

  setWidth(width) {
    this.width = width;
  }

  setHeight(height) {
    this.height = height;
  }
}
