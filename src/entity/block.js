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
    this.description = description;
    if (title.replaceAll(' ', '') === '') {
      this.title = Type;
    } else {
      this.title = title;
    }
    if (this.Type === 'Class' && additionalFields === null) {
      this.additionalFields.Attributes = [];
      this.additionalFields.Operations = [];
      this.additionalFields.stereotype = '';
    } else {
      this.additionalFields = additionalFields;
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
