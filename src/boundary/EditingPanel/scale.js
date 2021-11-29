import { dragMove, dragStart, dragStop } from './drag';
import { updateBlockProperties } from '../serverProtocol';

let handleGroup = null;
let lastModifiedObject = null;

// eslint-disable-next-line func-names
const start = function () {
  handleGroup.data('origTransform', handleGroup.transform().local);
};

// eslint-disable-next-line func-names
const move = function (dx) {
  let scale = 1 + (dx / 50);
  if (this.data('side') === 'left') {
    scale = 1 - (dx / 50);
  }
  handleGroup.attr({
    transform: handleGroup.data('origTransform') + (handleGroup.data('origTransform') ? 'S' : 's') + scale,
  });
};

// eslint-disable-next-line func-names
export const stop = function () {
};

function saveNewBlockScale(block) {
  const snap = block.data('snap');
  const newBlockBox = handleGroup.getBBox();
  const oldBlockBox = block.getBBox();

  let newBlock;
  if (block.data('Type') === 'Class') {
    newBlock = snap.rect(
      newBlockBox.x + (5 * (newBlockBox.width / oldBlockBox.width)),
      newBlockBox.y + (5 * (newBlockBox.height / oldBlockBox.height)),
      newBlockBox.width - (10 * (newBlockBox.width / oldBlockBox.width)),
      newBlockBox.height - (10 * (newBlockBox.height / oldBlockBox.height)),
    );
  } else if (block.data('Type') === 'Use-case') {
    newBlock = snap.ellipse(
      newBlockBox.cx,
      newBlockBox.cy,
      Math.round((newBlockBox.width - (10 * (newBlockBox.width / oldBlockBox.width))) / 2),
      Math.round((newBlockBox.height - (10 * (newBlockBox.height / oldBlockBox.height))) / 2),
    );
  }

  newBlock.data('Id', block.data('Id'));
  newBlock.data('Type', block.data('Type'));
  newBlock.drag(dragMove, dragStart, dragStop);
  newBlock.data('snap', block.data('snap'));
  newBlock.data('isScaling', false);
  // eslint-disable-next-line no-use-before-define
  newBlock.dblclick(turnOnscaleMode);

  updateBlockProperties(newBlock);

  handleGroup.selectAll('handler').remove();
  handleGroup.remove();

  lastModifiedObject = null;
}

// eslint-disable-next-line func-names
export const turnOnscaleMode = function () {
  const snap = this.data('snap');
  if (this.data('isScaling') === false) {
    if (lastModifiedObject != null) {
      // lastModifiedObject.data('isScaling', false);
      saveNewBlockScale(lastModifiedObject);
      // handleGroup.remove();
      // snap.append(lastModifiedObject);
    }
    lastModifiedObject = this;
    this.data('isScaling', true);
    const bb = this.getBBox();
    const handle = [];
    handle[0] = snap.circle(bb.x, bb.y, 5).attr({ class: 'handler', fill: 'blue' });
    handle[0].data('side', 'left');
    handle[0].drag(move, start, stop);
    handle[1] = snap.circle(bb.x + bb.width, bb.y, 5).attr({ class: 'handler', fill: 'blue' });
    handle[1].data('side', 'right');
    handle[1].drag(move, start, stop);
    handle[2] = snap.circle(bb.x, bb.y + bb.height, 5).attr({ class: 'handler', fill: 'blue' });
    handle[2].data('side', 'left');
    handle[2].drag(move, start, stop);
    handle[3] = snap.circle(bb.x + bb.width, bb.y + bb.height, 5).attr({ class: 'handler', fill: 'blue' });
    handle[3].data('side', 'right');
    handle[3].drag(move, start, stop);
    handleGroup = snap.group(this, handle[0], handle[1], handle[2], handle[3]);
  } else {
    saveNewBlockScale(this);
  }
};
