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

  svgCreate_Title(x_center, y_center, title) {
    return this.snap.text(
      x_center,
      y_center,
      title,
    ).attr({ stroke: 'black', dominantBaseline: 'middle', textAnchor: 'middle' });
  }

  svgCreate_byType(type, x, y, w, h) {
    if (type === 'Class') {
      return this.svgCreate_ClassBlock(x, y, w, h);
    } else if (type === 'Use-case') {
      return this.svgCreate_UseCase(x, y, w, h);
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

  svgCreate_UseCase(x, y, w, h) {
    const width = Math.round(w / 2);
    const height = Math.round(h / 2);
    const fig = this.snap.ellipse(x + width, y + height, width, height);
    fig.attr({ fill: bgColor, stroke: 'black', strokeWidth: 1 });
    return fig;
  }

  svgCreate_UseCaseCenter(x, y, w, h) {
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
    g.attr({
      transform: g.data('ot') + (g.data('ot') ? 'T' : 't') + [x, y],
    });
    return g;
  }

  svgCreate_BlockFields(x, y, w, h, additionalFields) {
    let titleOffset = 15;
    const g = this.snap.group();
    g.attr({ 'font-size': '13px' });
    for (const [key, values] of Object.entries(additionalFields)) {
      if (values.length === 0) {
        // eslint-disable-next-line no-continue
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
        // eslint-disable-next-line no-continue
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

