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
}

