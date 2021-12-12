import { dragMove, dragStart, dragStop } from '../boundary/DiagramUI/drag';
import { turnOnscaleMode, select } from '../boundary/DiagramUI/scale';

export default class BlockView {
  block = null;
  connections = null;
  isScaling = false;
  snap = null;
  blockGroup = null;
  constructor(block, snap, connections) {
    this.block = block;
    this.snap = snap;
    this.connections = connections;
  }

  redrawOnSnap(x = this.block.coords[0], y = this.block.coords[1],
    width = this.block.width, height = this.block.height) {
    if (this.blockGroup != null) {
      this.blockGroup.remove();
    }
    this.blockGroup = this.snap.group();

    if (this.block.Type === 'Class') {
      const newBlock = this.snap.rect(
        x, y,
        width, height);

      const blockTitle = this.snap.text(
        x + Math.round(width / 2),
        y + Math.round(height / 2),
        this.block.title,
      ).attr({ stroke: 'white', dominantBaseline: 'middle', textAnchor: 'middle' });

      this.blockGroup.add(newBlock, blockTitle);
    } else if (this.block.Type === 'Use-case') {
      const newBlock = this.snap.ellipse(
        x, y,
        Math.round(width / 2), Math.round(height / 2));

      const blockTitle = this.snap.text(
        x, y,
        this.block.title,
      ).attr({ stroke: 'white', dominantBaseline: 'middle', textAnchor: 'middle' });

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
}
