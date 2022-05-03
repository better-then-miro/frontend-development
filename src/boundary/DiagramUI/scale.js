/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-console */
/* eslint-disable func-names */

import { updateBlockPositionProperties } from '../serverProtocol';
import BlockView from '../SnapUtils/blockView';

let scalingBlockGroup = null;
let lastModifiedGroup = null;
let lastScaleX = 1;
let lastScaleY = 1;

const scaleStart = function () {
  scalingBlockGroup.data('origTransform', scalingBlockGroup.transform().local);
};

const scaleMove = function (dx, dy) {
  // TODO исправить скейл так, чтобы якори не считались за BBox
  const groupBox = scalingBlockGroup.getBBox();

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

  if (scalingBlockGroup[0].getBBox().width * scaleX > 100) {
    lastScaleX = scaleX;
  }

  if (scalingBlockGroup[0].getBBox().height * scaleY > 50) {
    lastScaleY = scaleY;
  }

  scalingBlockGroup.attr({
    transform: `${scalingBlockGroup.data('origTransform') + (scalingBlockGroup.data('origTransform') ? 'S' : 's') + lastScaleX},${lastScaleY}`,
  });
};

export const scaleStop = function () {
};

function updateBlockPosition(blockGroup) {
  scalingBlockGroup[0].remove();

  const coords = scalingBlockGroup.getBBox();

  if (blockGroup.data('blockView').block.Type === 'Use-case') {
    blockGroup.data('blockView').block.setCoords([Math.round(coords.cx), Math.round(coords.cy)]);
  } else {
    blockGroup.data('blockView').block.setCoords([Math.round(coords.x), Math.round(coords.y)]);
  }

  blockGroup.data('blockView').block.setWidth(Math.round(coords.width));
  blockGroup.data('blockView').block.setHeight(Math.round(coords.height));
  // eslint-disable-next-line no-param-reassign
  blockGroup.data('blockView').isScaling = false;

  const thisBlock = blockGroup.data('blockView').block;
  updateBlockPositionProperties(thisBlock.Id, thisBlock.width,
    thisBlock.height, thisBlock.coords);

  blockGroup.data('blockView').redrawOnSnap();
  scalingBlockGroup.remove();

  lastModifiedGroup = null;
}

// eslint-disable-next-line func-names
export const turnOnscaleMode = function () {
  this.data('blockView').removeLinkPoints();
  const snap = this.data('blockView').snap;

  if (lastModifiedGroup != null && lastModifiedGroup !== this) {
    updateBlockPosition(lastModifiedGroup);
  }
  lastModifiedGroup = this;

  if (this.data('blockView').isScaling === false) {
    this.data('blockView').isScaling = true;
    // Create group from figures (without texts) -> [i][0] - figure of i-th primitive
    // TODO when all block views will use such interface
    /* const g = this.snap.group();
    for (let i = 0; i < this.length; i += 1) {
      g.append(this[i][0]);
    } */
    const groupBbox = this.getBBox();
    const anchors = [];
    anchors[0] = snap.circle(groupBbox.x, groupBbox.y, 5).attr({ class: 'handler', fill: 'blue' });
    anchors[0].data('side', 'topleft');
    anchors[0].drag(scaleMove, scaleStart, scaleStop);
    anchors[1] = snap.circle(groupBbox.x + groupBbox.width, groupBbox.y, 5).attr({ class: 'handler', fill: 'blue' });
    anchors[1].data('side', 'topright');
    anchors[1].drag(scaleMove, scaleStart, scaleStop);
    anchors[2] = snap.circle(groupBbox.x, groupBbox.y + groupBbox.height, 5).attr({ class: 'handler', fill: 'blue' });
    anchors[2].data('side', 'bottomleft');
    anchors[2].drag(scaleMove, scaleStart, scaleStop);
    anchors[3] = snap.circle(groupBbox.x + groupBbox.width, groupBbox.y + groupBbox.height, 5).attr({ class: 'handler', fill: 'blue' });
    anchors[3].data('side', 'bottomright');
    anchors[3].drag(scaleMove, scaleStart, scaleStop);
    // TODO ^
    scalingBlockGroup = snap.group(this, anchors[0], anchors[1], anchors[2], anchors[3]);
  } else {
    updateBlockPosition(this);
  }
};

// eslint-disable-next-line import/no-mutable-exports
export let sel = null;
export const select = function () {
  // eslint-disable-next-line no-prototype-builtins
  if (BlockView.prototype.isPrototypeOf(this.data('blockView'))) {
    if (sel !== null) {
      sel.removeLinkPoints();
    }
    sel = this.data('blockView');
    sel.drawLinkPoints();
  }
};

// eslint-disable-next-line import/no-mutable-exports
export let selLink = null;
export const selectLink = function () {
  // eslint-disable-next-line no-prototype-builtins
  if (this.data('lineObject') !== null) {
    selLink = this.data('lineObject');
  }
};

export const setBlockToNull = function () {
  sel = null;
};

export const setLinkToNull = function () {
  selLink = null;
};
