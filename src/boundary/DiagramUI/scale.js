/* eslint-disable func-names */

import { updateBlockProperties } from '../serverProtocol';

let handleGroup = null;
let lastModifiedGroup = null;
let lastScaleX = 1;
let lastScaleY = 1;

const start = function () {
  handleGroup.data('origTransform', handleGroup.transform().local);
};

const move = function (dx, dy) {
  const groupBox = handleGroup.getBBox();
  let scaleX = 1;
  let scaleY = 1;
  if (this.data('side') === 'topleft') {
    scaleX = dx > 0 ?
      groupBox.width / (groupBox.width + dx) : (groupBox.width - dx) / groupBox.width;
    scaleY = dy > 0 ?
      groupBox.height / (groupBox.height + dy) : (groupBox.height - dy) / groupBox.height;
  } else if (this.data('side') === 'topright') {
    scaleX = dx > 0 ?
      (groupBox.width + dx) / groupBox.width : groupBox.width / (groupBox.width - dx);
    scaleY = dy > 0 ?
      groupBox.height / (groupBox.height + dy) : (groupBox.height - dy) / groupBox.height;
  } else if (this.data('side') === 'bottomleft') {
    scaleX = dx > 0 ?
      groupBox.width / (groupBox.width + dx) : (groupBox.width - dx) / groupBox.width;
    scaleY = dy > 0 ?
      (groupBox.height + dy) / groupBox.height : groupBox.height / (groupBox.height - dy);
  } else if (this.data('side') === 'bottomright') {
    scaleX = dx > 0 ?
      (groupBox.width + dx) / groupBox.width : groupBox.width / (groupBox.width - dx);
    scaleY = dy > 0 ?
      (groupBox.height + dy) / groupBox.height : groupBox.height / (groupBox.height - dy);
  }

  if (handleGroup[0].getBBox().width * scaleX > 100) {
    lastScaleX = scaleX;
  }

  if (handleGroup[0].getBBox().height * scaleY > 50) {
    lastScaleY = scaleY;
  }

  handleGroup.attr({
    transform: `${handleGroup.data('origTransform') + (handleGroup.data('origTransform') ? 'S' : 's') + lastScaleX},${lastScaleY}`,
  });
};

export const stop = function () {
};

function updateBlockPosition(blockGroup) {
  handleGroup.selectAll('circle.handler').remove();

  const coords = handleGroup.getBBox();

  if (blockGroup.data('blockView').block.Type === 'Use-case') {
    blockGroup.data('blockView').block.setCoords([Math.round(coords.cx), Math.round(coords.cy)]);
  } else {
    blockGroup.data('blockView').block.setCoords([Math.round(coords.x), Math.round(coords.y)]);
  }

  blockGroup.data('blockView').block.setWidth(Math.round(coords.width));
  blockGroup.data('blockView').block.setHeight(Math.round(coords.height));

  updateBlockProperties(blockGroup.data('blockView').block);

  blockGroup.data('blockView').redrawOnSnap();

  handleGroup.remove();

  lastModifiedGroup = null;
}

// eslint-disable-next-line func-names
export const turnOnscaleMode = function () {
  const snap = this.data('blockView').snap;

  if (this.data('blockView').isScaling === false) {
    if (lastModifiedGroup != null) {
      updateBlockPosition(lastModifiedGroup);
      // TODO: Fix issue with modifying block when the old block is selected
    }
    lastModifiedGroup = this;
    this.data('blockView').isScaling = true;
    const groupBbox = this.getBBox();
    const handle = [];
    handle[0] = snap.circle(groupBbox.x, groupBbox.y, 5).attr({ class: 'handler', fill: 'blue' });
    handle[0].data('side', 'topleft');
    handle[0].drag(move, start, stop);
    handle[1] = snap.circle(groupBbox.x + groupBbox.width, groupBbox.y, 5).attr({ class: 'handler', fill: 'blue' });
    handle[1].data('side', 'topright');
    handle[1].drag(move, start, stop);
    handle[2] = snap.circle(groupBbox.x, groupBbox.y + groupBbox.height, 5).attr({ class: 'handler', fill: 'blue' });
    handle[2].data('side', 'bottomleft');
    handle[2].drag(move, start, stop);
    handle[3] = snap.circle(groupBbox.x + groupBbox.width, groupBbox.y + groupBbox.height, 5).attr({ class: 'handler', fill: 'blue' });
    handle[3].data('side', 'bottomright');
    handle[3].drag(move, start, stop);
    handleGroup = snap.group(this, handle[0], handle[1], handle[2], handle[3]);
  } else {
    updateBlockPosition(this);
    this.data('blockView').isScaling = false;
  }
};

// eslint-disable-next-line import/no-mutable-exports
export let sel = null;
export const select = function () {
  sel = this;
};
