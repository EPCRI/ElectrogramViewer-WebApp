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
import annotationPlugin from 'chartjs-plugin-annotation';
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
  annotationPlugin
);

const myChartRef = React.createRef();
let datasets = [];
let labels = [];
const decimation = 1;
const gain = 4;
const separation = 16000;
const maxPointsOnChart = 20000;
let numPointsOnChart = maxPointsOnChart / decimation;
let dataIdxLeft = 0;
let dataIdxRight = numPointsOnChart;
const ecgColors = ['maroon', 'black', 'red', 'blue', 'black', 'green', 'red', 'orange', 'green', 'brown', 'black', 'purple']

const annotation = {
  type: 'line',
  borderColor: 'green',
  borderDash: [6, 6],
  borderWidth: 1,
  xMax: 8,
  xMin: 8,
  xScaleID: 'x',
  yMax: 0,
  yMin: 110,
  yScaleID: 'y'
};


export const data = {
  labels,
  datasets: [],
};

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
  
      const angle = Math.PI / 180;
  
      class CircleChevron {
        // constructor(x1,y1) {

        // }
        draw(ctx, x1, pixel) {
          ctx.beginPath();
          ctx.lineWidth = 5;
          ctx.strokeStyle = 'black';
          ctx.fillStyle = 'white';
          ctx.arc(x1, height / 2 + top, 15, angle * 0, angle * 360, false);
          ctx.stroke();
          ctx.fill();
          ctx.closePath();
    
          // chevron Arrow Left
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
      // ctx.beginPath();
      // ctx.fillStyle = 'lightgrey';
      // ctx.rect(left + 15, bottom + 60, width - 30, 15);
      // ctx.fill();
      // ctx.closePath();

      // ctx.beginPath();
      // ctx.fillStyle = 'rgba(255, 26, 104, 0.5)';
      // ctx.rect(left, bottom + 60, 15, 15);
      // ctx.rect(right - 30, bottom + 60, 15, 15);
      // ctx.fill();
      // ctx.closePath();

      // // moveable bar
      // let startingPoint = left + 15 + width;
      // const barWidth = (width - 30) / (chart.config.data.datasets[0].data.length / 100);


      // ctx.beginPath();
      // ctx.fillStyle = 'black';
      // ctx.rect(left + 15, bottom + 60, barWidth, 15);
      // ctx.fill();
      // ctx.closePath();
    }
  }
];

function mouseClickFunction(event) {
  console.log("mouseClickFunction()");
  const myChart = myChartRef.current;
  const { ctx, canvas, chartArea: {left, right, top, bottom, width, height} } = myChart;
  const x = event.x;
  const y = event.y;
  console.log(x, ' ', y);

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
    movechart,
    legend: {
      display: false
    },
  },
  onClick: function (evt, element) {
    mouseClickFunction(evt);
  }
};

function extractDataToDatasets() {
  const json = require('./test.json');
  datasets = [];
  labels = [];
  let sets = [];
  for (let i = 0; i < json['Channels'].length - 1; i++) {
    const channel = json['Channels'][i+1];
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    let data_points = json[channel]
    let firstPoint = data_points[0];
    data_points = data_points.filter((_,i) => i % decimation === 0);
    data_points = data_points.map(element=> (gain)*element + separation*(json['Channels'].length-2) - separation*(i-1));
    datasets.push({
      label: channel,
      data: data_points,
      borderColor: ecgColors[i],
    });
    sets.push({
      label: channel,
      data: data_points.slice(0, numPointsOnChart),
      borderColor: ecgColors[i],
    });
  }
  labels = json['Time']
  data.datasets = sets;
  data.labels = json['Time'].slice(0,numPointsOnChart);
  return data;
}

class ApexChart extends React.Component {
  
  constructor(props) {
    super(props);
    extractDataToDatasets();
    this.state = { zoom_value: 1 };
    this.handleZoomChange = this.handleZoomChange.bind(this);
  }

  handleZoomChange(event) {
    const chart = myChartRef.current;
    const zoomLevel = event.target.value;
    const config = chart.config;

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
      dataset.data = dataset.data.concat(datasets[index].data.slice(dataIdxLeft, dataIdxRight));
      dataset.data.splice(0, numPointsOnChart);
    });
    chart.update('none');
  }

  render() {

    return (
      <div className='chart-container'>
        <div style={{height: '100%', width: '100%'}}>
          <Line 
            ref={myChartRef}
            height={"100%"} 
            width={"100%"} 
            options={options}
            plugins={movechart}
            data={data} />
        </div>
        <div className='tool-box'>
          <select value={this.state.zoom_value} onChange={this.handleZoomChange}>
            <option value={1}>X1</option>
            <option value={2}>X2</option>
            <option value={3}>X3</option>
            <option value={4}>X4</option>
          </select>
        </div>
      </div>
    );
  }
}

export default ApexChart;