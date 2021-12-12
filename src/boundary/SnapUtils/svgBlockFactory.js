/* eslint-disable camelcase */
const bgColor = '#60efff';

export function svgCreate_ClassBlock(snap, x, y, w, h) {
  const r = snap.rect(x, y, w, h);
  r.attr({ fill: bgColor, stroke: 'black', strokeWidth: 1 });
  return r;
}


export function svgCreate_UseCase(snap, x, y, w, h) {
  const r = snap.ellipse(x, y, w, h);
  r.attr({ fill: bgColor, stroke: 'black', strokeWidth: 1 });
  return r;
}
