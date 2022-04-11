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
import { Line } from 'react-chartjs-2';
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

// const annotation2 = {
//   type: 'line',
//   borderColor: 'green',
//   borderDash: [6, 6],
//   borderWidth: 1,
//   xMax: 5,
//   xMin: 5,
//   xScaleID: 'x',
//   yMax: 0,
//   yMin: 110,
//   yScaleID: 'y'
// };

const annotation3 = {
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

export const options = {
  maintainAspectRatio: false,
  responsive: true,
  animation: false,
  spanGaps: true,
  plugins: {
    legend: {
      display: false,
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'x',
      },
      zoom: {
        limits: {
          x: {min: 5, max: 10},
        },
        wheel: {
          enabled: true,
        },
        mode: 'x',
      }
    }
  },
  elements: {
    point: {
        radius: 0, // default to disabled in all datasets
    }
  },
};

const labels = [];
const colors = [];
const decimation = 20;

export const data = {
  labels,
  datasets: [],
};

function extractDataToDatasets() {
  const datasets = [];
  const json = require('./test.json');
  for (let i = 0; i < json['Channels'].length - 1; i++) {
  // for (let i = 0; i < 1; i++) {
    const channel = json['Channels'][i+1];
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    console.log(json[channel].length);
    let data_points = json[channel]
    let firstPoint = data_points[0];
    let offset = -firstPoint;
    data_points = data_points.filter((_,i) => i % decimation == 0);
    console.log(data_points.length);
    data_points = data_points.map(element=> (3)*element + 132000 - 12000*(i-1));
    console.log(data_points.length);
    //data_points = data_points.map(element=> (1)*(element + offset));
    datasets.push({
      label: channel,
      data: data_points,
      borderColor: `rgb(${r}, ${g}, ${b})`,
    });
  }
  data.datasets = datasets
  data.labels = json['Time'].slice(0,data.datasets[0].data.length);
  console.log(data.datasets[0].data.length);
}

class ApexChart extends React.Component {
  constructor(props) {
    super(props);
    extractDataToDatasets();
  }

  render() {

    return (
      <Line
        height={'100%'}
        width={'100%'}
        options={options}
        data={data} 
      />
    );
  }
}

export default ApexChart;