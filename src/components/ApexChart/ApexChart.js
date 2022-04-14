import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart, Line } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationLinePlugin from '../../plugins/annotationline';
import './ApexChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
  annotationLinePlugin
);

const decimation = 1;
const gain = 4;
const separation = 16000;
const maxPointsOnChart = 20000;
let numPointsOnChart = maxPointsOnChart / decimation;
let dataIdxLeft = 0;
let dataIdxRight = numPointsOnChart;


const annotations = [];


export const data = {
  labels: [],
  datasets: [],
};

const movechart = [
  {
    id: 'movechart',

    afterEvent(chart, args) {
      const { ctx, canvas, chartArea: {left, right, top, bottom, width, height} } = chart;

      class AnnotationLine {

        draw(ctx, x1) {
          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'red';
          ctx.moveTo(x1, top);
          ctx.lineTo(x1, bottom);
          ctx.stroke();
          ctx.closePath();
        }

      }

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
      ctx.fillStyle = 'rgba(255, 26, 104, 0.5)';
      ctx.rect(left, bottom + 60, 15, 15);
      ctx.rect(right - 30, bottom + 60, 15, 15);
      ctx.fill();
      ctx.closePath();

      // moveable bar
      const min = dataIdxLeft;
      let startingPoint = left + 15 + width / chart.config.options.completeDataset.datasets[0].data.length * min;
      const barWidth = (width - 30) / chart.config.options.completeDataset.datasets[0].data.length * numPointsOnChart;
      const totalWidth = startingPoint + barWidth;
      if (totalWidth > width) {
        startingPoint = right - 30 - barWidth;
      }

      ctx.beginPath();
      ctx.fillStyle = 'black'; 
      ctx.rect(startingPoint, bottom + 60, barWidth, 15);
      ctx.fill();
      ctx.closePath();
    }
  }
];

function mouseClickFunction(event) {
  console.log("mouseClickFunction()");
  scrollButtonCheck(event);
}

function annotationCheck(event) {
  const x = event.x;
  const y = event.y;
  const myChart = event.chart;
  const { ctx, canvas, chartArea: {left, right, top, bottom, width, height} } = myChart;

  // if (x >= left + 30 && x <= right - 30) {
  //   myChartRef.current.update();
  //   let annotation = new AnnotationLine();
  //   annotation.draw(ctx, x);
  // }
}

function scrollButtonCheck(event) {
  const x = event.x;
  const y = event.y;
  const myChart = event.chart;
  const { ctx, canvas, chartArea: {left, right, top, bottom, width, height} } = myChart;
  const datasets = myChart.config.options.completeDataset.datasets;
  const labels = myChart.config.options.completeDataset.labels;

  if(x >= right - 30 && x <= right && y >= height / 2 + top - 15 && y <= height / 2 + top + 15) {
    let lbls = myChart.config.data.labels;
    dataIdxLeft += numPointsOnChart;
    dataIdxRight += numPointsOnChart;

    if (dataIdxRight >= datasets[0].data.length) {
      dataIdxLeft = datasets[0].data.length - numPointsOnChart;
      dataIdxRight = datasets[0].data.length;
      lbls = lbls.concat(labels.slice(dataIdxLeft, dataIdxRight));
      lbls.splice(0, numPointsOnChart);
      myChart.config.data.datasets.forEach((dataset, index) => {
        dataset.data = dataset.data.concat(datasets[index].data.slice(dataIdxLeft, dataIdxRight));
        dataset.data.splice(0, numPointsOnChart);
      })
    } else {
      lbls = lbls.concat(labels.slice(dataIdxLeft, dataIdxRight));
      lbls.splice(0, numPointsOnChart);
      myChart.config.data.labels = lbls;

      myChart.config.data.datasets.forEach((dataset, index) => {
        dataset.data = dataset.data.concat(datasets[index].data.slice(dataIdxLeft, dataIdxRight));
        dataset.data.splice(0, numPointsOnChart);
      })
    }
    myChart.update('none');
  }

  if(x >= left && x <= left + 30 && y >= height / 2 + top - 15 && y <= height / 2 + top + 15) {
    let lbls = myChart.config.data.labels;
    dataIdxLeft -= numPointsOnChart;
    dataIdxRight -= numPointsOnChart;
    if (dataIdxLeft <= 0) {
      dataIdxLeft = 0;
      dataIdxRight = numPointsOnChart;
      lbls = lbls.concat(labels.slice(dataIdxLeft, dataIdxRight));
      lbls.splice(0, numPointsOnChart);
      myChart.config.data.labels = lbls;
      myChart.config.data.datasets.forEach((dataset, index) => {
        dataset.data = dataset.data.concat(datasets[index].data.slice(dataIdxLeft, dataIdxRight));
        dataset.data.splice(0, numPointsOnChart);
      })
    } else {
      lbls = lbls.concat(labels.slice(dataIdxLeft, dataIdxRight));
      lbls.splice(0, numPointsOnChart);
      myChart.config.data.labels = lbls;

      myChart.config.data.datasets.forEach((dataset, index) => {
        dataset.data = dataset.data.concat(datasets[index].data.slice(dataIdxLeft, dataIdxRight));
        dataset.data.splice(0, numPointsOnChart);
      });
    }
    myChart.update('none');
  }

  console.log(`Left Index: ${dataIdxLeft}, Right Index: ${dataIdxRight}`);
}

export const options = {
  maintainAspectRatio: false,
  responsive: true,
  spanGaps: true,
  animation: false,
  interaction: {
  },
  ecgColors: ['maroon', 'black', 'red', 'blue', 'black', 'green', 'red', 'orange', 'green', 'brown', 'black', 'purple'],
  completeDataset: {
    datasets: [],
    labels: [],
  },
  electrogramParams: {
    decimation: 1,
    gain: 4,
    separation: 16000,
    maxPointsOnChar: 20000,
    dataIdxLeft: 0,
    dataIdxRight: 20000,
    get numPointsOnChart() {
      return this.maxPointsOnChart / this.decimation;
    },
  },
  layout: {
    padding: {
      right: 18,
      bottom: 40,
    }
  },
  scales: {
    x: {
      min: 0,
      max: numPointsOnChart,
      ticks: {
        autoSkip: true,
        maxTicksLimit: 40,
      },
    },
    y: {
      min: -5000,
      max: 205000,
      display: false,
      beginAtZero: true,
    }
  },
  elements: {
    point: {
        radius: 0, // default to disabled in all datasets
    },
    line: {
      borderWidth: 1.2,
    }
  },
  plugins: {
    legend: {
      display: false
    },
    corsair: {
      annotations: [],
      horizontal: false,
      vertical: true,
      color: 'red',
      dash: [],
      width: 1,
    }
  },
  onClick: function (evt, element) {
    mouseClickFunction(evt);
  }
};

function extractDataToDatasets() {
  const json = require('./test.json');
  options.completeDataset.datasets = [];
  options.completeDataset.labels = [];
  let sets = [];
  for (let i = 0; i < json['Channels'].length - 1; i++) {
    const channel = json['Channels'][i+1];
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    let data_points = json[channel]
    let firstPoint = data_points[0];
    data_points = data_points.filter((_,i) => i % options.electrogramParams.decimation === 0);
    data_points = data_points.map(element=> (gain)*element + separation*(json['Channels'].length-2) - separation*(i-1));
    options.completeDataset.datasets.push({
      label: channel,
      data: data_points,
      borderColor: options.ecgColors[i],
    });
    sets.push({
      label: channel,
      data: data_points.slice(0, numPointsOnChart),
      borderColor: options.ecgColors[i],
    });
  }
  options.completeDataset.labels = json['Time'];
  data.datasets = sets;
  data.labels = json['Time'].slice(0,numPointsOnChart);
  return data;
}


class ApexChart extends React.Component {
  
  constructor(props) {
    super(props);
    extractDataToDatasets();
    this.myChartRef = React.createRef();
    this.state = { zoom_value: 1 };
    this.handleZoomChange = this.handleZoomChange.bind(this);
  }

  handleZoomChange(event) {
    console.log(event);
    const zoomLevel = event.target.value;
    const config = this.myChartRef.current.config;
    const labels = options.completeDataset.labels;

    this.setState({ zoom_value: zoomLevel });
    numPointsOnChart = maxPointsOnChart / zoomLevel;
    
    // get new dataset 0 index array based on center of current window
    // result: zoom in is centered on currently viewed data
    console.log(config.data.labels.length / 2)
    const zoomInTime =config.data.labels[Math.floor(config.data.labels.length / 2)];
    console.log(`zoomInTime: ${zoomInTime}`);
    for (let i = 0; i < labels.length; i++) {
      // console.log(labels[i] + ' > ' + zoomInTime)
      if (labels[i] > zoomInTime) {
        if (i >= numPointsOnChart/2) {
          console.log('1');
          dataIdxLeft = i - numPointsOnChart/2;
        } else {
          console.log('2');
          dataIdxLeft = 0;
        }
        break;
      }
    }

    dataIdxRight = dataIdxLeft + numPointsOnChart;
    config.data = extractDataToDatasets();

    let lbls = config.data.labels;
    console.log(`startIdx: ${dataIdxLeft}, endIdx: ${dataIdxRight}`);
    lbls = lbls.concat(labels.slice(dataIdxLeft, dataIdxRight));
    lbls.splice(0, numPointsOnChart);
    console.log(lbls.length);
    config.data.labels = lbls;

    config.data.datasets.forEach((dataset, index) => {
      dataset.data = dataset.data.concat(options.completeDataset.datasets[index].data.slice(dataIdxLeft, dataIdxRight));
      dataset.data.splice(0, numPointsOnChart);
    });
    this.myChartRef.current.update('none');
  }

  render() {

    return (
      <div className='chart-container'>
        <div style={{height: '100%', width: '100%'}}>
          <Line 
            ref={this.myChartRef}
            height={"100%"} 
            width={"100%"} 
            options={options}
            plugins={movechart}
            data={extractDataToDatasets(options)} />
        </div>
        <div className='tool-box'>
          <select value={this.state.zoom_value} onChange={this.handleZoomChange}>
            <option value={8}>400</option>
            <option value={3.8}>200</option>
            <option value={2}>100</option>
            <option value={1}>67</option>
          </select>
        </div>
      </div>
    );
  }
}

export default ApexChart;