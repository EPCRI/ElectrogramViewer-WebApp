// annotationline.js
// custom line marker plugin

const annotationLinePlugin = {
  id: 'corsair',
  afterInit: (chart) => {
    chart.corsair = { x: 0, y: 0 }
  },
  afterEvent: (chart, evt) => {
    const { chartArea: { top, bottom, left, right } } = chart;
    const { x, y } = evt.event;
    if (x < left || x > right || y < top || y > bottom) {
      chart.corsair = { x, y, draw: false }
      chart.draw();
      return;
    }

    chart.corsair = { x, y, draw: true }
    console.log("chart.draw()");
    chart.draw();
  },
  afterDatasetsDraw: (chart, _, opts) => {
    const { ctx, chartArea: { top, bottom, left, right } } = chart;
    const { x, y, draw } = chart.corsair;

    if (!draw) {
      return;
    }

    ctx.lineWidth = opts.width || 0;
    ctx.setLineDash(opts.dash || []);
    ctx.strokeStyle = opts.color || 'black'

    console.log("ctx.save()");
    ctx.save();
    ctx.beginPath();
    if (opts.vertical) {
      ctx.moveTo(x, bottom);
      ctx.lineTo(x, top);
    }
    if (opts.horizontal) {
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
    }
    ctx.stroke();
    ctx.restore();
  }
}

export default annotationLinePlugin;