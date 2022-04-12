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

const movechart = {
  id: 'movechart',
  afterDraw(chart, args, pluginOptions) {
    console.log("afterDraw()");
    const { ctx, chartArea: {left, right, top, bottom, width, height} } = chart;

    const angle = Math.PI / 180;

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(102, 102, 102, 0.5)';
    ctx.fillStyle = 'white';
    ctx.arc(left, height / 2 + top, 15, angle * 0, angle * 360, false);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }
}

const chartpluginsset = [
  {
      afterDatasetDraw: (chart) => {
        const  { ctx } = chart
        console.log(ctx);
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(200,200)
        ctx.lineTo(200,100)
        ctx.lineTo(20,100)
        ctx.fillStyle='#E24545'
        ctx.fill()
      }
  }
];

export const options = {
  maintainAspectRatio: false,
  responsive: true,
  spanGaps: true,
  scales: {
    x: {
      min: 0,
      max: 4000,
    },
    y: {
      beginAtZero: true,
    }
  },
  elements: {
    point: {
        radius: 0, // default to disabled in all datasets
    }
  },
  plugins: {
    chartpluginsset,
    legend: {
      display: false
    },
  }
    // zoom: {
    //   pan: {
    //     enabled: true,
    //     mode: 'x',
    //   },
    //   zoom: {
    //     mode: 'x',
    //     wheel: {
    //       enabled: true,
    //     },
    //     limits: {
    //       x: {min: 0, max: 100}
    //     }
    //   }
    // },
};

const labels = [];
const decimation = 1;
const myChartRef = React.createRef();

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
    let data_points = json[channel]
    let firstPoint = data_points[0];
    let offset = -firstPoint;
    // data_points = data_points.filter((_,i) => i % decimation === 0);
    data_points = data_points.map(element=> (3)*element + 132000 - 12000*(i-1));
    //data_points = data_points.map(element=> (1)*(element + offset));
    datasets.push({
      label: channel,
      data: data_points,
      borderColor: `rgb(${r}, ${g}, ${b})`,
    });
  }
  data.datasets = datasets;
  data.labels = json['Time'].slice(0,data.datasets[0].data.length);
}

class ApexChart extends React.Component {
  
  constructor(props) {
    super(props);
    extractDataToDatasets();
    this.state = { zoom_value: 100 };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    let chart = myChartRef.current;
    console.log("zoom level before: " + chart.getZoomLevel());
    let zoomLevel = event.target.value === 'reset' ? 1 : 100/event.target.value;
    this.setState({ zoom_value: zoomLevel});
    console.log("Chart instance: " + chart);
    chart.resetZoom();
    chart.zoom(zoomLevel, 'none');
    console.log("set zoom level: " + zoomLevel);
    console.log("zoom level after: " + chart.getZoomLevel());
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
            data={data} />
        </div>
        {/* <div className='tool-box'>
          <select value={this.state.zoom_value} onChange={this.handleChange}>
            <option value={30}>30</option>
            <option value={40}>40</option>
            <option value={50}>50</option>
            <option value={60}>60</option>
            <option value={70}>70</option>
            <option value={80}>80</option>
            <option value={90}>90</option>
            <option value={100}>100</option>
            <option value={'reset'}>Reset</option>
          </select>
        </div> */}
      </div>
    );
  }
}

export default ApexChart;