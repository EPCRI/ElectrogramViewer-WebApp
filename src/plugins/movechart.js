// movechart.js
// custome plugin for scrolling buttons

const movechart = [
    {
      id: 'movechart',
  
      afterEvent(chart, args) {
        const { ctx, canvas, chartArea: {left, right, top, bottom, width, height} } = chart;
  
        canvas.addEventListener('mousemove', (event) => {
          const x = args.event.x;
          const y = args.event.y;
  
          if (x >= left && x <= left + 30 && y >= height / 2 + top - 15 && y <= height / 2 + top + 15) {
            canvas.style.cursor = 'pointer';
          } else if (x >= right - 30 && x <= right && y >= height / 2 + top - 15 && y <= height / 2 + top + 15) {
            canvas.style.cursor = 'pointer';
          } else {
            canvas.style.cursor = 'default';
          }
        });
      },
  
      afterDraw(chart, args, pluginOptions) {
        const { ctx, chartArea: {left, right, top, bottom, width, height} } = chart;
        const datasets = chart.config.options.completeDataset.datasets;
        const ecgParams = chart.config.options.electrogramParams;
    
        const angle = Math.PI / 180;
    
        class CircleChevron {
  
          draw(ctx, x1, pixel) {
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'black';
            ctx.fillStyle = 'white';
            ctx.arc(x1, height / 2 + top, 15, angle * 0, angle * 360, false);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
      
            // chevron Arrow
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'black';
            ctx.moveTo(x1 + pixel, height / 2 + top - 7.5);
            ctx.lineTo(x1 - pixel, height / 2 + top);
            ctx.lineTo(x1 + pixel, height / 2 + top + 7.5);
            ctx.stroke();
            ctx.closePath();
          }
        }
  
        let drawCircleLeft = new CircleChevron();
        drawCircleLeft.draw(ctx, left + 15 + 1.5, 5);
  
        let drawCircleRight = new CircleChevron();
        drawCircleRight.draw(ctx, right - 15 - 1.5, -5);
  
        // scrollbar
        ctx.beginPath();
        ctx.fillStyle = 'lightgrey';
        ctx.rect(left + 15, bottom + 60, width - 30, 15);
        ctx.fill();
        ctx.closePath();
  
        ctx.beginPath();
        ctx.fillStyle = 'lightgrey';
        ctx.rect(left, bottom + 60, 15, 15);
        ctx.rect(right - 30, bottom + 60, 15, 15);
        ctx.fill();
        ctx.closePath();
  
        // moveable bar
        const min = ecgParams.dataIdxLeft;
        let startingPoint = min * (width / datasets[0].data.length) + left + 15;
        // console.log(`${startingPoint} = ${left} + 15 + ${min} * (${width} / ${datasets[0].data.length})`);
        const barWidth = (ecgParams.numPointsOnChart / datasets[0].data.length) * (width - 30) ;
        // console.log(`${barWidth} = (${width} - 30) / ${datasets[0].data.length} * ${ecgParams.numPointsOnChart}`);
        const totalWidth = startingPoint + barWidth;
        if (startingPoint < left + 15) {
          startingPoint = left + 15;
        }
        if (totalWidth > width) {
          startingPoint = right - 30 - barWidth;
        }
  
        ctx.beginPath();
        ctx.fillStyle = 'grey'; 
        ctx.rect(startingPoint, bottom + 60, barWidth, 15);
        ctx.fill();
        ctx.closePath();
      }
    }
  ];

  export default movechart;