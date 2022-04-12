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
const numPointsOnChart = 20000 / decimation;
let dataIdxLeft = 0;
let dataIdxRight = numPointsOnChart;

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
      let startingPoint = left + 15 + width;
      const barWidth = (width - 30) / (chart.config.data.datasets[0].data.length / 100);


      ctx.beginPath();
      ctx.fillStyle = 'black';
      ctx.rect(left + 15, bottom + 60, barWidth, 15);
      ctx.fill();
      ctx.closePath();
    }
  }
];

function mouseClickFunction(event) {
  console.log("mouseClickFunction()");
  const myChart = myChartRef.current;
  const { ctx, canvas, chartArea: {left, right, top, bottom, width, height} } = myChart;
  const x = event.x;
  const y = event.y;

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
      myChart.config.data.datasets.forEach((dataset, index) => {
        dataset.data = dataset.data.concat(datasets[index].data.slice(dataIdxLeft, dataIdxRight));
        dataset.data.splice(0, numPointsOnChart);
        lbls = lbls.concat(labels.slice(dataIdxLeft, dataIdxRight));
        lbls.splice(0, numPointsOnChart);
        myChart.config.data.labels = lbls;
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
      myChart.config.data.datasets.forEach((dataset, index) => {
        dataset.data = dataset.data.concat(datasets[index].data.slice(dataIdxLeft, dataIdxRight));
        dataset.data.splice(0, numPointsOnChart);
        lbls = lbls.concat(labels.slice(dataIdxLeft, dataIdxRight));
        lbls.splice(0, numPointsOnChart);
        myChart.config.data.labels = lbls;
      })
    }
    myChart.update('none');
  }

  console.log(`Left Index: ${dataIdxLeft}, Right Index: ${dataIdxRight}`);
  console.log(myChart.config.data.datasets[0].data.length);
  console.log(myChart);
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
    data_points = data_points.map(element=> (3)*element + 132000 - 12000*(i-1));
    datasets.push({
      label: channel,
      data: data_points,
      borderColor: `rgb(${r}, ${g}, ${b})`,
    });
    sets.push({
      label: channel,
      data: data_points.slice(0, numPointsOnChart),
      borderColor: `rgb(${r}, ${g}, ${b})`,
    });
  }
  labels = json['Time']
  data.datasets = sets;
  data.labels = json['Time'].slice(0,numPointsOnChart);
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