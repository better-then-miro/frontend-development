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

  svgCreate_ClassBlock(x, y, w, h) {
    const fig = this.snap.rect(x, y, w, h);
    fig.attr({ fill: bgColor, stroke: 'black', strokeWidth: 1 });
    return fig;
  }


  svgCreate_UseCase(x, y, w, h) {
    const fig = this.snap.ellipse(x, y, w, h);
    fig.attr({ fill: bgColor, stroke: 'black', strokeWidth: 1 });
    return fig;
  }

  // eslint-disable-next-line no-unused-vars
  svgCreate_Actor(x, y, w, h) {
    const g = this.snap.group();
    g.data('ot', g.transform().local);
    Snap.load(actorIcon, (data) => {
      console.log(data);
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
      // eslint-disable-next-line no-console
      console.log(key, values);

      const keyTitle = this.snap.text(
        x + Math.round(w / 2),
        y + h + titleOffset,
        key,
      ).attr({ stroke: 'black', dominantBaseline: 'middle', textAnchor: 'middle' });
      titleOffset += 20;
      g.append(keyTitle);

      for (const valueIndex in values) {
        const valueTitle = this.snap.text(
          x + Math.round(w / 2),
          y + h + titleOffset,
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

