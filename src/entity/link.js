export default class Link {
  Id = null;
  Type = '';
  sId = null; // sorceID
  tId = null; // targetID
  // TODO additional fields. For example name and description
  constructor(Id, Type, sorceId, targetId) {
    this.Id = Id;
    Object.defineProperty(this, 'Id', { writable: false }); // readonly ID
    this.Type = Type;
    this.sId = sorceId;
    this.tId = targetId;
  }
}
