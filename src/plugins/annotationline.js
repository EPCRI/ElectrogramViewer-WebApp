class AnnotationLine {
  constructor(chart, x) {
    this.completed = false;
    this.x1 = x;
    this.x2 = x;
    this.time1 = AnnotationLine.pixelToTime(chart, x);
    this.time2 = this.time1;
    this.comment = '';
  }

  draw(chart) {
    const { ctx, chartArea: {top, bottom} } = chart;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'red'
    
    if (this.x1) {
      ctx.beginPath();
      ctx.moveTo(this.x1, bottom);
      ctx.lineTo(this.x1, top);
      ctx.stroke();
      ctx.closePath();
    }
    if (this.x2) {
      ctx.beginPath();
      ctx.moveTo(this.x2, bottom);
      ctx.lineTo(this.x2, top);
      ctx.stroke();
      ctx.closePath();

      ctx.beginPath();
      ctx.moveTo(this.x1, top - 50);
      ctx.lineTo(this.x2, top - 50);
      ctx.stroke();
      ctx.closePath();
    }
  }

  static pixelToTime(chart, x) {
    const { ctx, chartArea: {left, right, top, bottom, width, height} } = chart;
    const electrogramParams = chart.config.options.electrogramParams;
    const time = ((x - 7.5) / width) * electrogramParams.numPointsOnChart + electrogramParams.dataIdxLeft;
    console.log(`pixel: ${x}, timeIdx: ${Math.round(time)}, time: ${chart.config.options.completeDataset.labels[Math.round(time)]}`);
    return time;
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
          console.log("first");
          const annotation = new AnnotationLine(chart, x);
          corsair.annotations.push(annotation);
          corsair.drawingLine = true;
        } else {
          console.log("second");
          console.log(corsair.annotations[corsair.annotations.length - 1]);
          corsair.annotations[corsair.annotations.length - 1].completed = true;
          corsair.annotations[corsair.annotations.length - 1].x2 = x;
          corsair.annotations[corsair.annotations.length - 1].time2 = AnnotationLine.pixelToTime(chart, x);
          corsair.drawingLine = false;
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
    // console.log(annotations);
    annotations.forEach(element => {
      element.draw(chart);
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

    console.log("draw");
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, bottom);
    ctx.lineTo(x, top);
    ctx.stroke();
    ctx.restore();
  }
}

export default annotationLinePlugin;