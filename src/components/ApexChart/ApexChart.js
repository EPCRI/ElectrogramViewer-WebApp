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
import movechart from '../../plugins/movechart';
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
  annotationLinePlugin,
  movechart,
);

export const data = {
  labels: [],
  datasets: [],
};

const annotation = {
  type: 'line',
  borderColor: 'green',
  borderDash: [6, 6],
  borderWidth: 1,
  xMax: 300,
  xMin: 300,
  xScaleID: 'x',
  yMax: 0,
  yMin: 300,
  yScaleID: 'y'
};


function mouseClickFunction(event) {
  console.log("mouseClickFunction()");
  scrollButtonCheck(event);
}

function scrollButtonCheck(event) {
  const x = event.x;
  const y = event.y;
  const myChart = event.chart;
  const { ctx, canvas, chartArea: {left, right, top, bottom, width, height} } = myChart;
  const datasets = myChart.config.options.completeDataset.datasets;
  const labels = myChart.config.options.completeDataset.labels;
  const numPointsOnChart = myChart.config.options.electrogramParams.numPointsOnChart;


  if(x >= right - 30 && x <= right && y >= height / 2 + top - 15 && y <= height / 2 + top + 15) {
    let lbls = myChart.config.data.labels;
    myChart.config.options.electrogramParams.dataIdxLeft += numPointsOnChart;
    myChart.config.options.electrogramParams.dataIdxRight += numPointsOnChart;
    let dataIdxLeft = myChart.config.options.electrogramParams.dataIdxLeft;
    let dataIdxRight = myChart.config.options.electrogramParams.dataIdxRight;

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
    myChart.config.options.electrogramParams.dataIdxLeft -= numPointsOnChart;
    myChart.config.options.electrogramParams.dataIdxRight -= numPointsOnChart;
    let dataIdxLeft = myChart.config.options.electrogramParams.dataIdxLeft;
    let dataIdxRight = myChart.config.options.electrogramParams.dataIdxRight;
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

  // console.log(`Left Index: ${myChart.config.options.electrogramParams.dataIdxLeft}, Right Index: ${myChart.config.options.electrogramParams.dataIdxRight}`);
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
    maxPointsOnChart: 20000,
    dataIdxLeft: 0,
    dataIdxRight: 20000,
    numPointsOnChart: 20000,
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
      max: 20000,
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
      drawingLine: false,
      annotating: false,
      draw: true,
      color: 'red',
      dash: [],
      width: 1,
    },
  },
  onClick: function (evt, element) {
    mouseClickFunction(evt);
  }
};

function extractDataToDatasets() {
  const json = require('./test.json');
  const ecgParams = options.electrogramParams;
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
    data_points = data_points.filter((_,i) => i % ecgParams.decimation === 0);
    data_points = data_points.map(element=> (ecgParams.gain)*element + ecgParams.separation*(json['Channels'].length-2) - ecgParams.separation*(i-1));
    options.completeDataset.datasets.push({
      label: channel,
      data: data_points,
      borderColor: options.ecgColors[i],
    });
    sets.push({
      label: channel,
      data: data_points.slice(0, ecgParams.numPointsOnChart),
      borderColor: options.ecgColors[i],
    });
  }
  options.completeDataset.labels = json['Time'];
  data.datasets = sets;
  data.labels = json['Time'].slice(0, ecgParams.numPointsOnChart);
  return data;
}


class ApexChart extends React.Component {
  
  constructor(props) {
    super(props);
    extractDataToDatasets();
    this.myChartRef = React.createRef();
    this.state = { 
      zoom_value: 1,

    };
    this.handleZoomChange = this.handleZoomChange.bind(this);
  }

  handleZoomChange(event) {
    console.log(event);
    const zoomLevel = event.target.value;
    const config = this.myChartRef.current.config;
    const labels = options.completeDataset.labels;
    const ecgParams = this.myChartRef.current.config.options.electrogramParams;
    let dataIdxLeft = ecgParams.dataIdxLeft;
    let dataIdxRight = ecgParams.dataIdxRight;

    this.setState({ zoom_value: zoomLevel });
    const newNumPoints = ecgParams.maxPointsOnChart / zoomLevel;
    ecgParams.numPointsOnChart = newNumPoints;
    
    // get new dataset 0 index array based on center of current window
    // result: zoom in is centered on currently viewed data
    console.log(config.data.labels.length / 2)
    const zoomInTime =config.data.labels[Math.floor(config.data.labels.length / 2)];
    console.log(`zoomInTime: ${zoomInTime}`);
    for (let i = 0; i < labels.length; i++) {
      // console.log(labels[i] + ' > ' + zoomInTime)
      if (labels[i] > zoomInTime) {
        if (i >= newNumPoints/2) {
          console.log('1');
          dataIdxLeft = i - newNumPoints/2;
        } else {
          console.log('2');
          dataIdxLeft = 0;
        }
        break;
      }
    }

    dataIdxRight = dataIdxLeft + newNumPoints;
    config.data = extractDataToDatasets();

    let lbls = config.data.labels;
    console.log(`startIdx: ${dataIdxLeft}, endIdx: ${dataIdxRight}`);
    lbls = lbls.concat(labels.slice(dataIdxLeft, dataIdxRight));
    lbls.splice(0, newNumPoints);
    console.log(lbls.length);
    config.data.labels = lbls;
    ecgParams.dataIdxLeft = dataIdxLeft;
    ecgParams.dataIdxRight = dataIdxRight;
    config.data.datasets.forEach((dataset, index) => {
      dataset.data = dataset.data.concat(options.completeDataset.datasets[index].data.slice(dataIdxLeft, dataIdxRight));
      dataset.data.splice(0, newNumPoints);
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
            plugins={annotationLinePlugin}
            data={extractDataToDatasets(options)} />
        </div>
        <div className='tools-box'>
          <select value={this.state.zoom_value} onChange={this.handleZoomChange}>
            <option value={8}>400</option>
            <option value={3.8}>200</option>
            <option value={2}>100</option>
            <option value={1}>67</option>
          </select>
          <div className='tools-box-name'>Window</div>
          <button className='select-buttons' onClick={() => {
            this.myChartRef.current.config.options.plugins.corsair.annotating = true;
            console.log(this.myChartRef.current.config.options.plugins.corsair);
            }}>T1</button>
          <button className='select-buttons'>T2</button>
          <div>
            <button className='confirm-buttons' onClick={() => {
            this.myChartRef.current.config.options.plugins.corsair.annotating = false;
            console.log(this.myChartRef.current.config.options.plugins.corsair);
            }}>✓</button>
            <button className='confirm-buttons'onClick={() => {
            this.myChartRef.current.config.options.plugins.corsair.annotating = false;
            console.log(this.myChartRef.current.config.options.plugins.corsair);
            }}>☓</button>
          </div>
          <div className='tools-box-name'>Point</div>
          <button className='select-buttons'>✎</button>
          <div>
            <button className='confirm-buttons'>✓</button>
            <button className='confirm-buttons'>☓</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ApexChart;