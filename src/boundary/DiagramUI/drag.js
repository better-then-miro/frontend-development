/* eslint-disable func-names */

import { updateBlockProperties } from '../serverProtocol';

let boundsToDrag = { x1: 0, y1: 0, x2: 0, y2: 0 };
export const setBounds = (x1, y1, x2, y2) => {
  boundsToDrag = { x1, y1, x2, y2 };
};

export const dragMove = function (dx, dy, x, y) {
  if (this.data('blockView').isScaling === false) {
    if (x >= boundsToDrag.x1 && y >= boundsToDrag.y1 &&
      x <= boundsToDrag.x2 && y <= boundsToDrag.y2) {
      this.attr({
        transform: this.data('ot') + (this.data('ot') ? 'T' : 't') + [dx, dy],
      });

      // eslint-disable-next-line no-plusplus
      for (let i = this.data('blockView').connections.length; i--;) {
        this.data('blockView').snap.connection(this.data('blockView').connections[i]);
      }
    }

    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      this.data('saveDrag', true);
    }
  }
};

export const dragStart = function () {
  this.data('ot', this.transform().local);
  this.data('saveDrag', false);
};

export const dragStop = function () {
  const coords = this.getBBox();

  let newCoords = [];
  if (this.data('blockView').block.Type === 'Use-case') {
    newCoords = [Math.round(coords.cx), Math.round(coords.cy)];
  } else {
    newCoords = [Math.round(coords.x), Math.round(coords.y)];
  }

  if (this.data('saveDrag') === false) {
    // eslint-disable-next-line no-console
    console.log('Too small drag');
    return;
  }

  this.data('blockView').block.setCoords(newCoords);

  updateBlockProperties(this.data('blockView').block);

  this.data('blockView').redrawOnSnap();
};
