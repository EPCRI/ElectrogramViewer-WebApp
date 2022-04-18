class AnnotationLine {
  constructor(chart, idx1) {
    this.completed = false;
    this.idx1 = idx1;
    this.idx2 = idx1;
    this.comment = '';
  }

  draw(chart) {
    const { ctx, chartArea: {top, bottom} } = chart;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'red'
    const x1 = AnnotationLine.idxToPixel(chart, this.idx1);
    console.log(this.idx1 + ' ' + x1);
    const x2 = AnnotationLine.idxToPixel(chart, this.idx2);

    if (this.idx1) {
      ctx.beginPath();
      ctx.moveTo(x1, bottom);
      ctx.lineTo(x1, top);
      ctx.stroke();
      ctx.closePath();
    }
    if (this.idx2) {
      ctx.beginPath();
      ctx.moveTo(x2, bottom);
      ctx.lineTo(x2, top);
      ctx.stroke();
      ctx.closePath();

      ctx.beginPath();
      ctx.moveTo(x1, top - 50);
      ctx.lineTo(x2, top - 50);
      ctx.stroke();
      ctx.closePath();
    }
  }

  static pixelToIdx(chart, x) {
    const { ctx, chartArea: {left, right, top, bottom, width, height} } = chart;
    const ecgParams = chart.config.options.electrogramParams;
    // pixel (with offset correction) to total dataset index
    console.log(x);
    console.log(ecgParams);
    const dataIdx = Math.round(((x - left) / width) * ecgParams.numPointsOnChart + ecgParams.dataIdxLeft);
    console.log(`pixel: ${x}, timeIdx: ${dataIdx}, time: ${chart.config.options.completeDataset.labels[dataIdx]}`);
    return dataIdx;
  }

  static idxToPixel(chart, dataIdx) {
    const { ctx, chartArea: {left, right, top, bottom, width, height} } = chart;
    const ecgParams = chart.config.options.electrogramParams;
    //todo offset ref
    console.log("LEFT " + left);
    const x = (dataIdx - ecgParams.dataIdxLeft) * width / ecgParams.numPointsOnChart + left;
    console.log(`dataIdx: ${dataIdx}, time: ${chart.config.options.completeDataset.labels[dataIdx]}, pixel: ${x}`);
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
      console.log(event);
      if (x >= left + 30 && x <= right - 40 && corsair.annotating) {
        console.log("Adding annotation");
        console.log(chart.config.options.plugins);
        console.log(chart.config.options.plugins.corsair.annotations);
        if (corsair.drawingLine === false) {
          console.log("T1 Line");
          const annotation = new AnnotationLine(chart, AnnotationLine.pixelToIdx(chart, x));
          corsair.annotations.push(annotation);
          corsair.drawingLine = true;
        } else {
          console.log("T2 Line");
          console.log(corsair.annotations[corsair.annotations.length - 1]);
          corsair.annotations[corsair.annotations.length - 1].completed = true;
          corsair.annotations[corsair.annotations.length - 1].idx2 = AnnotationLine.pixelToIdx(chart, x);
        }
        console.log(corsair.annotations);
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