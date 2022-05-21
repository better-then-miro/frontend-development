/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable camelcase */
/* eslint-disable max-len */
import { dragMove, dragStart, dragStop } from '../DiagramUI/drag';
import { turnOnscaleMode, select } from '../DiagramUI/scale';
import SvgBlockFactory from './svgBlockFactory';

const templates = require('./assets/blockTypes.json');
/**
 * Стоит использовать следующее соглашение на структуру объекта blockGroup, хранящего svg объект
 * Объект хранится ввиде группы, где на первом уровне индексации blockGroup[i] лежат части объекта
 * в виде группы из двух элементов: blockGroup[i][0] - фигура(примитив)
 *                                  blockGroup[i][1] - текст, привязанный к фигуре (необязательно внутри фигуры)
 */
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

  redrawOnSnap(/*x = this.block.coords[0], y = this.block.coords[1],
    width = this.block.width, height = this.block.height*/) {
    if (this.blockGroup != null) {
      this.blockGroup.remove();
    }
    // eslint-disable-next-line no-console
    console.log(this.block);
    this.blockGroup = this.snap.group();
    let template;
    if (this.block.Type === 'Class') {
      if (this.block.additionalFields.stereotype === '' || this.block.additionalFields.stereotype == null) {
        template = templates.filter(elem => elem.name === 'Class-default')[0];
      } else { template = templates.filter(elem => elem.name === `Class-${this.block.additionalFields.stereotype}`)[0]; }
    } else {
      template = templates.filter(elem => elem.name === this.block.title)[0];
    }
    this.blockGroup = this.constructSVGBlock(template, this.block);
    for (let i = this.connections.length; i--;) {
      this.snap.connection(this.connections[i]);
    }

    this.blockGroup.drag(dragMove, dragStart, dragStop);
    this.blockGroup.dblclick(turnOnscaleMode);
    this.blockGroup.click(select);
    this.blockGroup.data('blockView', this);
  }

  constructSVGBlock(template, block) {
    const elements = template.elements;
    const x = block.coords[0];
    let y = block.coords[1];
    const width = block.width;
    const height = this.block.height;
    let fixedHeightSum = 0;
    let fixedHeightNum = 0;
    for (const element of elements) {
      if (element.height != null) {
        fixedHeightSum += element.height;
        fixedHeightNum++;
      }
    }

    const svgParts = [];
    for (const element of elements) {
      let currentElementHeight = Math.round((height - fixedHeightSum) / (elements.length - fixedHeightNum));
      if (element.height != null) {
        currentElementHeight = element.height;
      }
      let svgPrimitive = null;
      if (element.shape != null) {
        svgPrimitive = this.factory.svgPrimitive_forName(element.shape, x, y, width, currentElementHeight);
      } else if (element['shape-svg'] != null) {
        svgPrimitive = this.factory.svgPrimitive_fromFile(element['shape-svg'], x, y, width, currentElementHeight);
      } else {
        console.log('Couldn`t find shape', element);
      }
      const svgTexts = [];
      let verticalOffset = 0;
      // TODO This for isn`t needed more, it is better to delete it with array in config in future
      for (let i = 0; i < element.textFieldsCnts.length; i++) {
        const currName = element.textFieldsNames[i];
        if (element.textFieldsCnts[i] === 1) {
          const x_center = x + (width / 2);
          const y_center = y + (currentElementHeight / 2);

          if (currName === '<title>') {
            svgTexts.push(this.factory.svgCreate_Titile(x_center, y_center, block.title));
          } else {
            svgTexts.push(this.factory.svgCreate_Titile(x_center, y_center, block.additionalFields[currName]));
          }
        } else if (element.textFieldsCnts[i] === '*') {
          const fields = {
            currName: this.block.additionalFields[element.textFieldsNames[i]],
          };
          const result = this.factory.svgCreate_TextFields(x, y + verticalOffset, width, fields);
          verticalOffset += result.mydata_resultingOffset;
          delete result.mydata_resultingOffset;
          svgTexts.push(result);
        } else {
          console.log('Couldn`t understand field count type');
        }
      }
      const svgTextsGroup = this.factory.svgConstruct(...svgTexts);
      const svgElementGroup = this.factory.svgConstruct(svgPrimitive, svgTextsGroup);
      svgParts.push(svgElementGroup);
      y += currentElementHeight;
    }
    return this.factory.svgConstruct(...svgParts);
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
