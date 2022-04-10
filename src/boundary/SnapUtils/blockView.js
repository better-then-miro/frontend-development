/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable camelcase */
/* eslint-disable max-len */
import { dragMove, dragStart, dragStop } from '../DiagramUI/drag';
import { turnOnscaleMode, select } from '../DiagramUI/scale';
import SvgBlockFactory from './svgBlockFactory';

export default class BlockView {
  block = null;
  connections = null;
  isScaling = false;
  snap = null;
  factory = null;
  blockGroup = null;
  constructor(block, snap, connections) {
    this.block = block;
    this.snap = snap;
    this.connections = connections;
    this.factory = new SvgBlockFactory(snap);
  }

  redrawOnSnap(x = this.block.coords[0], y = this.block.coords[1],
    width = this.block.width, height = this.block.height) {
    if (this.blockGroup != null) {
      this.blockGroup.remove();
    }
    this.blockGroup = this.snap.group();
    // TODO переделать на примитивы все остальные случаи кроме класса
    if (this.block.Type === 'Class') {
      // Constructing upper half of class block
      // TODO решить что делать с высотой верхней части
      const upperHeight = 30;
      const upperRect = this.factory.svgPrimitive_Rectangle(x, y, width, upperHeight);
      const blockTitle = this.factory.svgCreate_Title(
        x + Math.round(width / 2),
        y + Math.round(upperHeight / 2),
        this.block.title);
      const upperHalf = this.factory.svgConstruct(upperRect, blockTitle);
      // Constructing lower half of class block
      const lowerRect = this.factory.svgPrimitive_Rectangle(x, y + upperHeight, width, height - upperHeight);
      const newFields = this.factory.svgCreate_BlockFields(x, y + upperHeight, width, height - upperHeight,
        this.block.additionalFields);
      const lowerHalf = this.factory.svgConstruct(lowerRect, newFields);

      this.blockGroup = this.factory.svgConstruct(upperHalf, lowerHalf);
    } else if (this.block.Type === 'Use-case') {
      const newBlock = this.factory.svgCreate_UseCaseCenter(x, y,
        Math.round(width / 2), Math.round(height / 2));

      const blockTitle = this.snap.text(
        x, y,
        this.block.title,
      ).attr({ stroke: 'black', dominantBaseline: 'middle', textAnchor: 'middle' });

      this.blockGroup.add(newBlock, blockTitle);
    } else if (this.block.Type === 'Actor') {
      const newBlock = this.factory.svgCreate_Actor(x, y,
        Math.round(width / 2), Math.round(height / 2));

      const blockTitle = this.snap.text(
        x + Math.round(width / 2), y + height,
        this.block.title,
      ).attr({ stroke: 'black', dominantBaseline: 'middle', textAnchor: 'middle' });

      this.blockGroup.add(newBlock, blockTitle);
    }

    // eslint-disable-next-line no-plusplus
    for (let i = this.connections.length; i--;) {
      this.snap.connection(this.connections[i]);
    }

    this.blockGroup.drag(dragMove, dragStart, dragStop);
    this.blockGroup.dblclick(turnOnscaleMode);
    this.blockGroup.click(select);
    this.blockGroup.data('blockView', this);
  }

  drawLinkPoints() {
    const bbox = this.blockGroup.getBBox();
    const p = [{
      x: bbox.x + (bbox.width / 4),
      y: bbox.y - 1,
    }, {
      x: bbox.x + (bbox.width / 2),
      y: bbox.y - 1,
    }, {
      x: bbox.x + ((bbox.width / 4) * 3),
      y: bbox.y - 1,
    }, {
      x: bbox.x + (bbox.width / 4),
      y: bbox.y + bbox.height + 1,
    }, {
      x: bbox.x + (bbox.width / 2),
      y: bbox.y + bbox.height + 1,
    }, {
      x: bbox.x + ((bbox.width / 4) * 3),
      y: bbox.y + bbox.height + 1,
    }, {
      x: bbox.x - 1,
      y: bbox.y + (bbox.height / 4),
    }, {
      x: bbox.x - 1,
      y: bbox.y + (bbox.height / 2),
    }, {
      x: bbox.x - 1,
      y: bbox.y + ((bbox.height / 4) * 3),
    }, {
      x: bbox.x + bbox.width + 1,
      y: bbox.y + (bbox.height / 4),
    }, {
      x: bbox.x + bbox.width + 1,
      y: bbox.y + (bbox.height / 2),
    }, {
      x: bbox.x + bbox.width + 1,
      y: bbox.y + ((bbox.height / 4) * 3),
    }];

    const points = [];
    p.forEach((point) => {
      const snapPoint = this.snap.circle(point.x, point.y, 3).attr({ fill: 'blue' });
      points.push(snapPoint);
    });

    this.blockGroup.data('linkPoints', points);
  }

  removeLinkPoints() {
    const points = this.blockGroup.data('linkPoints');
    if (points != null) {
      points.forEach((point) => {
        point.remove();
      });

      this.blockGroup.data('linkPoints', null);
    }
  }
}
