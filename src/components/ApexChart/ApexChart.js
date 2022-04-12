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
const labels = [];
const decimation = 10;
const numPointsOnChart = 400;

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

const movechart = [
  {
    id: 'movechart',

    afterEvent(chart, args) {
      const { ctx, canvas, chartArea: {left, right, top, bottom, width, height} } = chart;

      canvas.addEventListener('mousemove', (event) => {
        const x = args.event.x;
        const y = args.event.y;

        if (x >= left - 15 && x <= left + 15 && y >= height / 2 + top - 15 && y <= height / 2 + top + 15) {
          canvas.style.cursor = 'pointer';
        } else if (x >= right - 15 && x <= right + 15 && y >= height / 2 + top - 15 && y <= height / 2 + top + 15) {
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
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'rgba(102, 102, 102, 0.5)';
          ctx.fillStyle = 'white';
          ctx.arc(x1, height / 2 + top, 15, angle * 0, angle * 360, false);
          ctx.stroke();
          ctx.fill();
          ctx.closePath();
    
          // chevron Arrow Left
          ctx.beginPath();
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'rgba(255, 26, 104, 0.5)';
          ctx.moveTo(x1 + pixel, height / 2 + top - 7.5);
          ctx.lineTo(x1 - pixel, height / 2 + top);
          ctx.lineTo(x1 + pixel, height / 2 + top + 7.5);
          ctx.stroke();
          ctx.closePath();
        }
      }

      let drawCircleLeft = new CircleChevron();
      drawCircleLeft.draw(ctx, left, 5);

      let drawCircleRight = new CircleChevron();
      drawCircleRight.draw(ctx, right, -5);

    }
  }
];

function mouseClickFunction(event) {
  console.log("mouseClickFunction()");
  console.log(event);
  const myChart = myChartRef.current;
  const { ctx, canvas, chartArea: {left, right, top, bottom, width, height} } = myChart;
  const rect = canvas.getBoundingClientRect();
  const x = event.x;
  const y = event.y;
  console.log(`x: ${x}  y: ${y}`);

  if(x >= right - 15 && x <= right + 15 && y >= height / 2 + top - 15 && y <= height / 2 + top + 15) {
    myChart.options.scales.x.min = myChart.options.scales.x.min + numPointsOnChart;
    myChart.options.scales.x.max = myChart.options.scales.x.max + numPointsOnChart;
    if (myChart.options.scales.x.max >= myChart.data.datasets[0].data.length) {
      myChart.options.scales.x.min = myChart.data.datasets[0].data.length - numPointsOnChart;
      myChart.options.scales.x.max = myChart.data.datasets[0].data.length;
    }
    myChart.update();
  }

  if(x >= left - 15 && x <= left + 15 && y >= height / 2 + top - 15 && y <= height / 2 + top + 15) {
    myChart.options.scales.x.min = myChart.options.scales.x.min - numPointsOnChart;
    myChart.options.scales.x.max = myChart.options.scales.x.max - numPointsOnChart;
    if (myChart.options.scales.x.max <= 0) {
      myChart.options.scales.x.min = 0;
      myChart.options.scales.x.max = numPointsOnChart;
    }
    myChart.update();
  }
  console.log("xmin: " + myChart.options.scales.x.min + ", xmax: " + myChart.options.scales.x.max);
}

// function moveScroll() {
//   console.log("moveScroll()");
//   canvas.addEventListener('click', mouseClickFunction);
// }

export const options = {
  maintainAspectRatio: false,
  responsive: true,
  spanGaps: true,
  animation: false,
  layout: {
    padding: {
      right:18,
    }
  },
  scales: {
    x: {
      min: 0,
      max: numPointsOnChart,
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
    movechart,
    legend: {
      display: false
    },
  },
  onClick: function (evt, element) {
    mouseClickFunction(evt);
  }
};

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
    let data_points = json[channel];
    let firstPoint = data_points[0];
    data_points = data_points.filter((_,i) => i % decimation === 0);
    data_points = data_points.map(element=> (3)*element + 132000 - 12000*(i-1));
    data_points = data_points.slice(0,20000);
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
            plugins={movechart}
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