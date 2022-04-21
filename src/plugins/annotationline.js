class AnnotationLine {

  constructor(chart, idx1) {
    this.completed = false;
    this.timeCreated = Date.now();
    this.comment = '';
    this.idx1 = idx1;
    this.t1 = chart.config.options.completeDataset.labels[this.idx1];
    this.idx2 = idx1;
    this.t2 = chart.config.options.completeDataset.labels[this.idx1];
  }

  draw(chart) {
    const { ctx, chartArea: {top, bottom} } = chart;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'red'
    const x1 = AnnotationLine.idxToPixel(chart, this.idx1);
    const x2 = AnnotationLine.idxToPixel(chart, this.idx2);

    // First line
    ctx.beginPath();
    ctx.moveTo(x1, bottom);
    ctx.lineTo(x1, top);
    ctx.stroke();
    ctx.closePath();

    // second line
    ctx.beginPath();
    ctx.moveTo(x2, bottom);
    ctx.lineTo(x2, top);
    ctx.stroke();
    ctx.closePath();

    // draw connecting line
    ctx.beginPath();
    ctx.moveTo(x1, top + 25);
    ctx.lineTo(x2, top + 25);
    ctx.stroke();
    ctx.closePath();

    // draw time diff
    ctx.beginPath();
    ctx.font = "bold large system-ui";
    if (Math.abs(Math.round(x2 - x1)) < 80) {
      ctx.textAlign = "end";
      ctx.fillText(chart.config.options.completeDataset.labels[Math.abs(Math.round(this.idx2 - this.idx1))] * 1000 + 'ms', x1 < x2 ? x1 - 10 : x2 - 10, top + 20);
    } else {
      ctx.textAlign = "center";
      ctx.fillText(chart.config.options.completeDataset.labels[Math.abs(Math.round(this.idx2 - this.idx1))] * 1000 + 'ms', (x1 + x2)/2, top + 20);
    }
  }

  static pixelToIdx(chart, x) {
    const { ctx, chartArea: {left, right, top, bottom, width, height} } = chart;
    const ecgParams = chart.config.options.electrogramParams;
    // pixel (with offset correction) to total dataset index
    const dataIdx = Math.round(((x - left) / width) * ecgParams.numPointsOnChart + ecgParams.dataIdxLeft);
    return dataIdx;
  }

  static idxToPixel(chart, dataIdx) {
    const { ctx, chartArea: {left, right, top, bottom, width, height} } = chart;
    const ecgParams = chart.config.options.electrogramParams;
    const x = (dataIdx - ecgParams.dataIdxLeft) * width / ecgParams.numPointsOnChart + left;
    return x;
  }
}

const annotationLinePlugin = {
  id: 'corsair',
  afterInit: (chart) => {
    const corsair = chart.config.options.plugins.corsair;
    corsair.x = 0;
    corsair.y = 0;
    chart.canvas.addEventListener('click', (event) => {
      const { chartArea: { top, bottom, left, right } } = chart;
      const x = event.offsetX;
      if (x >= left + 30 && x <= right - 40 && corsair.annotating) {
       
        if (corsair.drawingLine === false) {
          console.log("T1 Line");
          const annotation = new AnnotationLine(chart, AnnotationLine.pixelToIdx(chart, x));
          corsair.annotations.push(annotation);
          corsair.drawingLine = true;
        } else {
          const idx2 = AnnotationLine.pixelToIdx(chart, x);
          corsair.annotations[corsair.annotations.length - 1].completed = true;
          corsair.annotations[corsair.annotations.length - 1].idx2 = idx2;
          corsair.annotations[corsair.annotations.length - 1].t2 = chart.config.options.completeDataset.labels[idx2];
        }
      }
    });
  },

  afterEvent: (chart, evt) => {
    const { chartArea: { top, bottom, left, right } } = chart;
    let corsair = chart.config.options.plugins.corsair;
    const { x, y } = evt.event;
    if (x < left || x > right || y < top || y > bottom) {
      corsair.x = x;
      corsair.draw = false;
      chart.draw();
      return;
    }
    if (corsair.annotating) {
      corsair.x = x;
      corsair.draw = true;
      chart.draw();
    }
  },

  afterDraw(chart, args, pluginOptions) {
    const { ctx, chartArea: {left, right, top, bottom, width, height} } = chart;
    const datasets = chart.config.options.completeDataset.datasets;
    const annotations = chart.config.options.plugins.corsair.annotations;
    const ecgParams = chart.config.options.electrogramParams;
    annotations.forEach(element => {
      if (element.idx1 > ecgParams.dataIdxLeft && element.idx2 < ecgParams.dataIdxRight) {
        element.draw(chart);
      }
    });
  },

  afterDatasetsDraw: (chart, _, opts) => {
    const { ctx, chartArea: { top, bottom, left, right } } = chart;
    const corsair = chart.config.options.plugins.corsair;
    const { x, draw } = corsair;

    if (!draw) {
      return;
    }

    ctx.lineWidth = opts.width || 0;
    ctx.setLineDash(opts.dash || []);
    ctx.strokeStyle = opts.color || 'black'

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, bottom);
    ctx.lineTo(x, top);
    ctx.stroke();
    ctx.restore();
  }
}

export default annotationLinePlugin;