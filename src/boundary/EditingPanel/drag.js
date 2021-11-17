import { updateBlockProperties } from '../serverProtocol';

// eslint-disable-next-line import/no-mutable-exports,prefer-const
export let boundsToDrag = { x1: 0, y1: 0, x2: 0, y2: 0 };
export const setBounds = (x1, y1, x2, y2) => {
  boundsToDrag = { x1, y1, x2, y2 };
};

// eslint-disable-next-line func-names
export const dragMove = function (dx, dy, x, y) {
  if (x >= boundsToDrag.x1 && y >= boundsToDrag.y1 &&
      x <= boundsToDrag.x2 && y <= boundsToDrag.y2) {
    this.attr({
      transform: this.data('ot') + (this.data('ot') ? 'T' : 't') + [dx, dy],
    });
  }
};

// eslint-disable-next-line func-names
export const dragStart = function () {
  this.data('ot', this.transform().local);
};

// eslint-disable-next-line func-names
export const dragStop = function () {
  // eslint-disable-next-line no-console
  console.log('Stop dragging');

  const coords = this.node.getBoundingClientRect();

  const properties = {
    block_id: this.data('id'),
    'x_left:': Math.round(coords.left),
    'y_top:': Math.round(coords.top),
    'width:': Math.round(coords.width),
    'Height:': Math.round(coords.height),
  };

  updateBlockProperties(properties);
};
