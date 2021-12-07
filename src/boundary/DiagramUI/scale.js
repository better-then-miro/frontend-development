/* eslint-disable func-names */

import { dragMove, dragStart, dragStop } from './drag';
import { updateBlockProperties } from '../serverProtocol';
import DiagramUI from './DiagramUI';

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
      updateBlockPosition(lastModifiedGroup);
    }
    lastModifiedGroup = this;
    this.data('isScaling', true);
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
  }
};

// eslint-disable-next-line import/no-mutable-exports
export let sel = null;

export const select = function () {
  // eslint-disable-next-line no-console
  console.log(this);
  DiagramUI.data().selectedBlock = this;
  sel = this;
  // eslint-disable-next-line no-console
  console.log(sel);
};
