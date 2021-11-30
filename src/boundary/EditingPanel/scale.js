/* eslint-disable func-names */

import { dragMove, dragStart, dragStop } from './drag';
import { updateBlockProperties } from '../serverProtocol';

let handleGroup = null;
let lastModifiedGroup = null;

const start = function () {
  handleGroup.data('origTransform', handleGroup.transform().local);
};

const move = function (dx, dy) {
  let scaleX = 1;
  let scaleY = 1;
  if (this.data('side') === 'topleft') {
    scaleX = 1 - (dx / 50);
    scaleY = 1 - (dy / 50);
  } else if (this.data('side') === 'topright') {
    scaleX = 1 + (dx / 50);
    scaleY = 1 - (dy / 50);
  } else if (this.data('side') === 'bottomleft') {
    scaleX = 1 - (dx / 50);
    scaleY = 1 + (dy / 50);
  } else if (this.data('side') === 'bottomright') {
    scaleX = 1 + (dx / 50);
    scaleY = 1 + (dy / 50);
  }

  handleGroup.attr({
    transform: `${handleGroup.data('origTransform') + (handleGroup.data('origTransform') ? 'S' : 's') + scaleX},${scaleY}`,
  });
};

export const stop = function () {
};

function saveNewBlockScale(blockGroup) {
  const snap = blockGroup.data('snap');
  const newBlockBox = handleGroup.getBBox();
  const oldBlockBox = blockGroup.getBBox();

  let newBlock;
  let blockTitle;
  if (blockGroup.data('Type') === 'Class') {
    newBlock = snap.rect(
      newBlockBox.x + (5 * (newBlockBox.width / oldBlockBox.width)),
      newBlockBox.y + (5 * (newBlockBox.height / oldBlockBox.height)),
      newBlockBox.width - (10 * (newBlockBox.width / oldBlockBox.width)),
      newBlockBox.height - (10 * (newBlockBox.height / oldBlockBox.height)),
    );
    blockTitle = snap.text(
      newBlockBox.x + (5 * (newBlockBox.width / oldBlockBox.width)) +
        ((newBlockBox.width - (10 * (newBlockBox.width / oldBlockBox.width))) / 2),
      newBlockBox.y + (5 * (newBlockBox.height / oldBlockBox.height)) +
        ((newBlockBox.height - (10 * (newBlockBox.height / oldBlockBox.height))) / 2),
      blockGroup[1].node.textContent,
    ).attr({ stroke: 'white', dominantBaseline: 'middle', textAnchor: 'middle' });
  } else if (blockGroup.data('Type') === 'Use-case') {
    newBlock = snap.ellipse(
      newBlockBox.cx,
      newBlockBox.cy,
      Math.round((newBlockBox.width - (10 * (newBlockBox.width / oldBlockBox.width))) / 2),
      Math.round((newBlockBox.height - (10 * (newBlockBox.height / oldBlockBox.height))) / 2),
    );
    blockTitle = snap.text(
      newBlockBox.cx,
      newBlockBox.cy,
      blockGroup[1].node.textContent,
    ).attr({ stroke: 'white', dominantBaseline: 'middle', textAnchor: 'middle' });
  }

  const newBlockGroup = snap.group(newBlock, blockTitle);
  newBlockGroup.data('Id', blockGroup.data('Id'));
  newBlockGroup.data('Type', blockGroup.data('Type'));
  newBlockGroup.drag(dragMove, dragStart, dragStop);
  newBlockGroup.data('snap', blockGroup.data('snap'));
  newBlockGroup.data('isScaling', false);
  // eslint-disable-next-line no-use-before-define
  newBlockGroup.dblclick(turnOnscaleMode);

  updateBlockProperties(newBlockGroup);

  handleGroup.selectAll('handler').remove();
  handleGroup.remove();

  lastModifiedGroup = null;
}

// eslint-disable-next-line func-names
export const turnOnscaleMode = function () {
  const snap = this.data('snap');
  if (this.data('isScaling') === false) {
    if (lastModifiedGroup != null) {
      saveNewBlockScale(lastModifiedGroup);
    }
    lastModifiedGroup = this;
    this.data('isScaling', true);
    const bb = this.getBBox();
    const handle = [];
    handle[0] = snap.circle(bb.x, bb.y, 5).attr({ class: 'handler', fill: 'blue' });
    handle[0].data('side', 'topleft');
    handle[0].drag(move, start, stop);
    handle[1] = snap.circle(bb.x + bb.width, bb.y, 5).attr({ class: 'handler', fill: 'blue' });
    handle[1].data('side', 'topright');
    handle[1].drag(move, start, stop);
    handle[2] = snap.circle(bb.x, bb.y + bb.height, 5).attr({ class: 'handler', fill: 'blue' });
    handle[2].data('side', 'bottomleft');
    handle[2].drag(move, start, stop);
    handle[3] = snap.circle(bb.x + bb.width, bb.y + bb.height, 5).attr({ class: 'handler', fill: 'blue' });
    handle[3].data('side', 'bottomright');
    handle[3].drag(move, start, stop);
    handleGroup = snap.group(this, handle[0], handle[1], handle[2], handle[3]);
  } else {
    saveNewBlockScale(this);
  }
};
