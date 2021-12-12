export default class Block {
  Id = null;
  Type = '';
  coords = [null, null];
  width = null;
  height = null;
  title = '';
  description = '';
  additionalFields = {
    // attrs, methods for 'Class' type
  };
  constructor(Id, Type, x, y, width, height, title = `Default name ${Id}`, description = '', additionalFields = null) {
    this.Id = Id;
    Object.defineProperty(this, 'Id', { writable: false }); // readonly ID
    this.Type = Type;
    this.coords = [x, y];
    this.width = width;
    this.height = height;
    this.title = title;
    this.description = description;
    if (this.Type === 'Class' && additionalFields === null) {
      this.additionalFields.attrs = [];
      this.additionalFields.methods = [];
    }
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

  addAttribute(attrContent) {
    if (this.Type === 'Class') {
      this.additionalFields.attrs.push(attrContent);
    }
  }

  addMethod(methodContent) {
    if (this.Type === 'Class') {
      this.additionalFields.attrs.push(methodContent);
    }
  }
}
