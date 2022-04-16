// annotationline.js
// custom line marker plugin
const annotations = [];

const annotation2 = {
  type: 'line',
  borderColor: 'green',
  borderDash: [6, 6],
  borderWidth: 1,
  xMax: 100,
  xMin: 100,
  xScaleID: 'x',
  yMax: 0,
  yMin: 300,
  yScaleID: 'y'
};

class AnnotationLine {
  constructor(x) {
    this.state = {x: x};
  }

  draw(chart) {
    console.log("AnnotationLine draw()");
    const { ctx, chartArea: {top, bottom} } = chart;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'red'
    
    ctx.beginPath();
    ctx.moveTo(this.state.x, bottom);
    ctx.lineTo(this.state.x, top);
    ctx.stroke();
  }
}

const annotationLinePlugin = {
  id: 'corsair',
  afterInit: (chart) => {

    chart.corsair = { x: 0, y: 0 }
    // chart.canvas.addEventListener('click', (event) => {
    //   const x = event.offsetX;
    //   chart.config.options.plugins.annotation.annotations['annotation2'] = annotation2;
    // });
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