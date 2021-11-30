/* eslint-disable func-names */

import { updateBlockProperties } from '../serverProtocol';

let boundsToDrag = { x1: 0, y1: 0, x2: 0, y2: 0 };
export const setBounds = (x1, y1, x2, y2) => {
  boundsToDrag = { x1, y1, x2, y2 };
};

export const dragMove = function (dx, dy, x, y) {
  if (this.data('isScaling') === false) {
    if (x >= boundsToDrag.x1 && y >= boundsToDrag.y1 &&
      x <= boundsToDrag.x2 && y <= boundsToDrag.y2) {
      this.attr({
        transform: this.data('ot') + (this.data('ot') ? 'T' : 't') + [dx, dy],
      });
    }
  }
};

export const dragStart = function () {
  this.data('ot', this.transform().local);
};

export const dragStop = function () {
  // eslint-disable-next-line no-console
  console.log('Stop dragging');
  updateBlockProperties(this);
};
