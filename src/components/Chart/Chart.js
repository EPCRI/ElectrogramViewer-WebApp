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
import faker from 'faker';
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';

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
  responsive: true,
  animation: false,
  spanGaps: true,
  plugins: {
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
  elements: {
    point: {
        radius: 0 // default to disabled in all datasets
    }
  },
};

const labels = Array.from({length: 10000}, (_, index) => index + 1);

export const data = {
  labels,
  datasets: [],
};

function extractDataToDatasets() {
  const datasets = [];
  const json = require('./test.json');
  for (let i = 0; i < json['Channels'].length - 1; i++) {
    const channel = json['Channels'][i+1];
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    let data_points = json[channel].slice(0,10000);
    let firstPoint = data_points[0];
    let offset = -firstPoint;
    data_points = data_points.map(element=> (3)*element + 132000 - 12000*(i-1));
    //data_points = data_points.map(element=> (1)*(element + offset));
    console.log(data_points);
    datasets.push({
      label: channel,
      data: data_points,
      borderColor: `rgb(${r}, ${g}, ${b})`,
      backgroundColor: `rgb(${r}, ${g}, ${b}, 0.5)`
    });
  }
  data.datasets = datasets;
  data.labels = json['Time'].slice(0,10000);
}

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    extractDataToDatasets();
    
  }

  render() {

    return (
      <div id=''>
        <Line 
          options={options} 
          data={data} />
      </div>
    );
  }
}

export default Chart;