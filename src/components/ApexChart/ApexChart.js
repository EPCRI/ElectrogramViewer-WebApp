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
import Chart from "react-apexcharts";
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
      limits: {
        x: {min: 0, max: 100}
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
    let data_points = json[channel].slice(0,10000);
    let firstPoint = data_points[0];
    let offset = -firstPoint;
    data_points = data_points.map(element=> (3)*element + 132000 - 12000*(i-1));
    //data_points = data_points.map(element=> (1)*(element + offset));
    console.log(data_points);
    datasets.push({
      label: channel,
      data: data_points,
    });
    colors.push(`#${r.toString(16)}${g.toString(16)}${b.toString(16)}`);
  }
  data.datasets = datasets.slice(0,10000);
  data.labels = json['Time'].slice(0,10000);
}

class ApexChart extends React.Component {
  constructor(props) {
    super(props);
    extractDataToDatasets();
    // this.state = {
    //   options: {
    //     chart: {
    //       id: "basic-line"
    //     },
    //     colors: colors,
    //     tooltip: {
    //       enabled: false,
    //     }
    //   },
    //   series: data.datasets,
    // };
  }

  render() {

    return (
      <div classNam='chartWrapper'>
        <div className='chartAreaWrapper'>
          <Line
            height={'1000'}
            width={'100'}
            options={options}
            data={data} />
        </div>
      </div>
      // <Chart
      //   options={this.state.options}
      //   series={this.state.series}
      //   type="line"
      //   width="500"
      // />
    );
  }
}

export default ApexChart;