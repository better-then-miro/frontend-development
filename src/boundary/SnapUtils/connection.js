/* eslint-disable object-shorthand */
/* eslint-disable prefer-template */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
import Snap from 'snapsvg-cjs';

Snap.plugin((Snap, Paper) => {
  Paper.prototype.connection = function (firstBlockView, secondBlockView, linkType, line = '#555', bg = '#999') {
    if (firstBlockView.line && firstBlockView.from && firstBlockView.to) {
      line = firstBlockView;
      firstBlockView = line.from;
      secondBlockView = line.to;
      linkType = line.linkType;
    }
    const bb1 = firstBlockView.blockGroup.getBBox();
    const bb2 = secondBlockView.blockGroup.getBBox();
    const p = [{
      x: bb1.x + (bb1.width / 2),
      y: bb1.y - 1,
    }, {
      x: bb1.x + (bb1.width / 2),
      y: bb1.y + bb1.height + 1,
    }, {
      x: bb1.x - 1,
      y: bb1.y + (bb1.height / 2),
    }, {
      x: bb1.x + bb1.width + 1,
      y: bb1.y + (bb1.height / 2),
    }, {
      x: bb2.x + (bb2.width / 2),
      y: bb2.y - 21,
    }, {
      x: bb2.x + (bb2.width / 2),
      y: bb2.y + bb2.height + 21,
    }, {
      x: bb2.x - 21,
      y: bb2.y + (bb2.height / 2),
    }, {
      x: bb2.x + bb2.width + 21,
      y: bb2.y + (bb2.height / 2),
    }];
    const d = {};
    const dis = [];
    let dx = 0;
    let dy = 0;
    let res;

    for (let i = 0; i < 4; i += 1) {
      for (let j = 4; j < 8; j += 1) {
        dx = Math.abs(p[i].x - p[j].x);
        dy = Math.abs(p[i].y - p[j].y);
        if ((i === j - 4) || (((i !== 3 && j !== 6) || p[i].x < p[j].x) && ((i !== 2 && j !== 7) ||
          p[i].x > p[j].x) && ((i !== 0 && j !== 5) || p[i].y > p[j].y) && ((i !== 1 && j !== 4) ||
          p[i].y < p[j].y))
        ) {
          dis.push(dx + dy);
          d[dis[dis.length - 1]] = [i, j];
        }
      }
    }

    if (dis.length === 0) {
      res = [0, 4];
    } else {
      res = d[Math.min(...dis)];
    }
    const x1 = p[res[0]].x;
    const y1 = p[res[0]].y;
    const x4 = p[res[1]].x;
    const y4 = p[res[1]].y;

    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    const x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3);
    const y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3);
    const x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3);
    const y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    const path = [`M${x1.toFixed(3)}`, `${y1.toFixed(3)}C${x2}`, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(',');

    let arrowPoints = null;
    if (x4 === (bb2.x - 21)) {
      arrowPoints = [x4, y4 - 5, x4, y4 + 5, x4 + 20, y4];
    } else if (x4 === (bb2.x + bb2.width + 21)) {
      arrowPoints = [x4, y4 - 5, x4, y4 + 5, x4 - 20, y4];
    } if (y4 === (bb2.y - 21)) {
      arrowPoints = [(bb2.x + (bb2.width / 2)) - 5, y4,
        (bb2.x + (bb2.width / 2)) + 5, y4, (bb2.x + (bb2.width / 2)), y4 + 20];
    } else if (y4 === (bb2.y + bb2.height + 21)) {
      arrowPoints = [(bb2.x + (bb2.width / 2)) - 5, y4,
        (bb2.x + (bb2.width / 2)) + 5, y4, (bb2.x + (bb2.width / 2)), y4 - 20];
    }
    const arrowPointsStr = arrowPoints.join(',');

    if (line && line.line) {
      line.bg.attr({ path });
      if (linkType === 'Association') {
        line.line.attr({
          path,
        });
        line.arrow.attr({ points: arrowPointsStr });
      } else if (linkType === 'Dependency') {
        line.line.attr({
          path,
          'stroke-dasharray': 10 + ' ' + 10,
          'stroke-dashoffset': 10,
          'stroke-width': 4,
        });
        line.arrow.attr({ points: arrowPointsStr });
      } else {
        line.line.attr({
          path,
        });
      }
    } else {
      const color = typeof line === 'string' ? line : '#000';
      if (linkType === 'Association') {
        const arrow = this.polyline().attr({
          stroke: '#000',
          fill: '#000',
          points: arrowPointsStr,
        });
        return {
          bg: bg && bg.split && this.path(path).attr({
            stroke: bg.split('|')[0],
            fill: 'none',
            'stroke-width': bg.split('|')[1] || 3,
          }),
          line: this.path(path).attr({
            stroke: color,
            fill: 'none',
          }),
          linkType: linkType,
          from: firstBlockView,
          to: secondBlockView,
          arrow: arrow,
        };
      } else if (linkType === 'Dependency') {
        const arrow = this.polyline().attr({
          stroke: '#000',
          fill: '#000',
          points: arrowPointsStr,
        });
        return {
          bg: bg && bg.split && this.path(path).attr({
            fill: 'none',
          }),
          line: this.path(path).attr({
            stroke: color,
            fill: 'none',
            'stroke-dasharray': 10 + ' ' + 10,
            'stroke-dashoffset': 10,
            'stroke-width': 4,
          }),
          linkType: linkType,
          from: firstBlockView,
          to: secondBlockView,
          arrow: arrow,
        };
      }

      return {
        bg: bg && bg.split && this.path(path).attr({
          stroke: bg.split('|')[0],
          fill: 'none',
          'stroke-width': bg.split('|')[1] || 3,
        }),
        line: this.path(path).attr({
          stroke: color,
          fill: 'none',
        }),
        linkType: linkType,
        from: firstBlockView,
        to: secondBlockView,
      };
    }
  };
});
