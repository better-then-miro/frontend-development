/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
/* eslint-disable no-console */
import Snap from 'snapsvg-cjs';
import actorIcon from './assets/actor.svg';

const bgColor = '#60efff';

export default class SvgBlockFactory {
  snap = null;
  constructor(snap) {
    this.snap = snap;
  }

  svgPrimitive_forName(name, x, y, w, h, color = bgColor, stroke = 'black') {
    switch (name) {
      case 'rect':
        return this.svgPrimitive_Rectangle(x, y, w, h, color, stroke);
      case 'ellipse':
        return this.svgPrimitive_Ellipse(x, y, w, h);
      default :
        console.log('Don`t know such primitive');
        return null;
    }
  }

  /**
   * Load svg figure as primitive (svg figure should have size 80x80)
   */
  svgPrimitive_fromFile(filename, x, y, w, h) {
    const g = this.snap.group();
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const icon = require(`./assets/${filename}`);
    g.data('ot', g.transform().local);
    Snap.load(icon, (data) => {
      g.append(data);
    });

    const t = new Snap.Matrix();
    t.scale(w / 80, h / 80, x, y); // scale object
    t.translate(x, y);
    g.transform(t); // apply transformation to object

    return g;
  }

  svgPrimitive_Rectangle(x, y, w, h, color = bgColor, stroke = 'black') {
    const fig = this.snap.rect(x, y, w, h);
    fig.attr({ fill: color, stroke, strokeWidth: 1 });
    return fig;
  }

  svgConstruct(...figures) {
    const g = this.snap.group();
    g.add(figures);
    return g;
  }

  /*svgConstructFromArr(figures) {
    const g = this.snap.group();
    g.add(figures);
    return g;
  }*/

  svgCreate_Titile(x_center, y_center, title) {
    return this.snap.text(
      x_center,
      y_center,
      title,
    ).attr({ stroke: 'black', dominantBaseline: 'middle', textAnchor: 'middle' });
  }

  svgCreate_TextFields(x, y, w, fields) {
    let titleOffset = 15;
    const g = this.snap.group();
    g.attr({ 'font-size': '13px' });
    for (const key in fields) {
      const values = fields[key];
      if (fields[key].length === 0) {
        continue;
      }

      const keyTitle = this.snap.text(
        x + Math.round(w / 2),
        y + titleOffset,
        key,
      ).attr({ stroke: 'black', dominantBaseline: 'middle', textAnchor: 'middle' });
      titleOffset += 20;
      g.append(keyTitle);

      for (const valueIndex in values) {
        const valueTitle = this.snap.text(
          x + Math.round(w / 2),
          y + titleOffset,
          values[valueIndex],
        ).attr({ dominantBaseline: 'start', textAnchor: 'middle' });
        titleOffset += 15;
        g.append(valueTitle);
      }
      titleOffset += 10;
      g.mydata_resultingOffset = titleOffset;
    }
    return g;
  }

  svgCreate_byType(type, x, y, w, h) {
    if (type === 'Class') {
      return this.svgCreate_ClassBlock(x, y, w, h);
    } else if (type === 'Use-case') {
      return this.svgPrimitive_Ellipse(x, y, w, h);
    } else if (type === 'Actor') {
      return this.svgCreate_Actor(x, y, w, h);
    }
    return null;
  }

  svgCreate_ClassBlock(x, y, w, h) {
    const fig = this.snap.rect(x, y, w, h);
    fig.attr({ fill: bgColor, stroke: 'black', strokeWidth: 1 });
    return fig;
  }

  svgPrimitive_Ellipse(x, y, w, h) {
    const width = Math.round(w / 2);
    const height = Math.round(h / 2);
    const fig = this.snap.ellipse(x + width, y + height, width, height);
    fig.attr({ fill: bgColor, stroke: 'black', strokeWidth: 1 });
    return fig;
  }

  svgPrimitive_EllipseCenter(x, y, w, h) {
    const fig = this.snap.ellipse(x, y, w, h);
    fig.attr({ fill: bgColor, stroke: 'black', strokeWidth: 1 });
    return fig;
  }

  // eslint-disable-next-line no-unused-vars
  svgCreate_Actor(x, y, w, h) {
    const g = this.snap.group();
    g.data('ot', g.transform().local);
    Snap.load(actorIcon, (data) => {
      g.append(data);
    });

    const t = new Snap.Matrix();
    t.scale(w / 80, h / 80, x, y); // scale object
    t.translate(x, y);
    g.transform(t); // apply transformation to object

    return g;
  }

  svgCreate_BlockFields(x, y, w, h, additionalFields) {
    let titleOffset = 15;
    const g = this.snap.group();
    g.attr({ 'font-size': '13px' });
    for (const [key, values] of Object.entries(additionalFields)) {
      if (values.length === 0) {
        continue;
      }

      if (key === 'stereotype') { // Stereotype title
        if (values !== '') {
          const keyTitle = this.snap.text(
            x + Math.round(w / 2),
            y - 40,
            values,
          ).attr({ stroke: 'black', dominantBaseline: 'middle', textAnchor: 'middle' });
          g.append(keyTitle);
        }
        continue;
      }

      const keyTitle = this.snap.text(
        x + Math.round(w / 2),
        y + titleOffset,
        key,
      ).attr({ stroke: 'black', dominantBaseline: 'middle', textAnchor: 'middle' });
      titleOffset += 20;
      g.append(keyTitle);

      for (const valueIndex in values) {
        const valueTitle = this.snap.text(
          x + Math.round(w / 2),
          y + titleOffset,
          values[valueIndex],
        ).attr({ dominantBaseline: 'start', textAnchor: 'middle' });
        titleOffset += 15;
        g.append(valueTitle);
      }
      titleOffset += 10;
    }

    return g;
  }
}

