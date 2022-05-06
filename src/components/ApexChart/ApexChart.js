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
import { BallTriangle } from  'react-loader-spinner';
import { getFileData, getAnnotationData } from '../../utils/fileIO';
import annotationLinePlugin, { AnnotationLine } from '../../plugins/annotationline';
import movechart from '../../plugins/movechart';
import styles from './ApexChart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationLinePlugin,
  movechart,
);

export const data = {
  labels: [],
  datasets: [],
};

const initialData = {
  labels: [0],
  datasets: [
    {
      label: "",
      data: [0],
      borderColor: 'black'
    }
  ],
}


function mouseClickFunction(event) {
  console.log("mouseClickFunction()");
  console.log(`Clicked ${event.native.which === 1 ? 'right' : 'left'} mouse button`);
  if (event.native.which === 1) {
    scrollButtonCheck(event);
  }
}

function scrollButtonCheck(event) {
  const x = event.x;
  const y = event.y;
  const myChart = event.chart;
  const { ctx, canvas, chartArea: {left, right, top, bottom, width, height} } = myChart;
  const datasets = myChart.config.options.completeDataset.datasets;
  const labels = myChart.config.options.completeDataset.labels;
  const numPointsOnChart = myChart.config.options.electrogramParams.numPointsOnChart;
  let dataIdxLeft = myChart.config.options.electrogramParams.dataIdxLeft;
  let dataIdxRight = myChart.config.options.electrogramParams.dataIdxRight;
  // console.log(`INITIAL - left: ${dataIdxLeft}, right: ${dataIdxRight}, numPoints: ${numPointsOnChart}`);

  if(x >= right - 30 && x <= right && y >= height / 2 + top - 15 && y <= height / 2 + top + 15) {
    let lbls = myChart.config.data.labels;
    dataIdxLeft += numPointsOnChart;
    dataIdxRight += numPointsOnChart;

    if (dataIdxRight >= datasets[0].data.length) {
      console.log(1);
      dataIdxLeft = datasets[0].data.length - numPointsOnChart;
      dataIdxRight = datasets[0].data.length;
      lbls = lbls.concat(labels.slice(dataIdxLeft, dataIdxRight));
      lbls.splice(0, numPointsOnChart + 1);
      lbls = lbls.map(element => element.toFixed(2));
      myChart.config.data.datasets.forEach((dataset, index) => {
        dataset.data = dataset.data.concat(datasets[index].data.slice(dataIdxLeft, dataIdxRight));
        dataset.data.splice(0, numPointsOnChart);
      })
    } else {
      console.log(`1 - left: ${dataIdxLeft}, right: ${dataIdxRight}, numPoints: ${numPointsOnChart}`);
      lbls = lbls.concat(labels.slice(dataIdxLeft, dataIdxRight));
      lbls.splice(0, numPointsOnChart + 1);
      lbls = lbls.map(element => element.toFixed(2));
      myChart.config.data.labels = lbls;

      myChart.config.data.datasets.forEach((dataset, index) => {
        dataset.data = dataset.data.concat(datasets[index].data.slice(dataIdxLeft, dataIdxRight));
        dataset.data.splice(0, numPointsOnChart);
      })
    }
  }

  if(x >= left && x <= left + 30 && y >= height / 2 + top - 15 && y <= height / 2 + top + 15) {
    let lbls = myChart.config.data.labels;
    dataIdxLeft -= numPointsOnChart;
    dataIdxRight -= numPointsOnChart;
    if (dataIdxLeft <= 0) {
      dataIdxLeft = 0;
      dataIdxRight = numPointsOnChart;
      lbls = lbls.concat(labels.slice(dataIdxLeft, dataIdxRight));
      lbls.splice(0, numPointsOnChart + 1);
      lbls = lbls.map(element => element.toFixed(2));
      myChart.config.data.labels = lbls;
      myChart.config.data.datasets.forEach((dataset, index) => {
        dataset.data = dataset.data.concat(datasets[index].data.slice(dataIdxLeft, dataIdxRight));
        dataset.data.splice(0, numPointsOnChart);
      })
    } else {
      lbls = lbls.concat(labels.slice(dataIdxLeft, dataIdxRight));
      lbls.splice(0, numPointsOnChart + 1);
      lbls = lbls.map(element => element.toFixed(2));
      myChart.config.data.labels = lbls;

      myChart.config.data.datasets.forEach((dataset, index) => {
        dataset.data = dataset.data.concat(datasets[index].data.slice(dataIdxLeft, dataIdxRight));
        dataset.data.splice(0, numPointsOnChart);
      });
    }
  }
  console.log(`dataIdxLeft: ${dataIdxLeft}, dataIdxRight: ${dataIdxRight}`);
  myChart.config.options.electrogramParams.dataIdxLeft = dataIdxLeft;
  myChart.config.options.electrogramParams.dataIdxRight = dataIdxRight;
  console.log(event.chart);
  myChart.update('none');
  console.log(myChart.chartArea.width);
  // console.log(`Left Index: ${myChart.config.options.electrogramParams.dataIdxLeft}, Right Index: ${myChart.config.options.electrogramParams.dataIdxRight}`);
}

export const options = {
  maintainAspectRatio: false,
  responsive: true,
  spanGaps: true,
  animation: false,
  interaction: {
  },
  events: ["click", "mousemove"],
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
    dataIdxRight: 10000,
    numPointsOnChart: 10000,
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
        crossAlign: "start",
        maxTicksLimit: 40,
        maxRotation: 90,
        minRotation: 90,
      },
    },
    y: {
      min: -10000,
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

// Function to prepare signal channel data arrays with all json extracted data
async function extractAllDataToDatasets(fileIdx) {
  const response = await getFileData(fileIdx);
  let json = response.file;
  const ecgParams = options.electrogramParams;
  options.completeDataset.datasets = [];
  options.completeDataset.labels = [];
  let sets = [];
  for (let i = 0; i < json['Channels'].length - 1; i++) {
    const channel = json['Channels'][i+1];
    let data_points = json[channel]
    data_points = data_points.filter((_,i) => i % ecgParams.decimation === 0);
    data_points = data_points.map(element=> (ecgParams.gain)*element + ecgParams.separation*(json['Channels'].length-2) - ecgParams.separation*(i-1));
    options.completeDataset.datasets.push({
      label: channel,
      data: data_points,
      borderColor: options.ecgColors[1],
    });
    sets.push({
      label: channel,
      data: data_points.slice(ecgParams.dataIdxLeft, ecgParams.dataIdxRight),
      borderColor: "black",
    });
  }
  options.completeDataset.labels = json['Time'];
  data.datasets = sets;
  data.labels = json['Time'].slice(ecgParams.dataIdxLeft, ecgParams.dataIdxRight).map(element => element.toFixed(2));
  return data;
}

// Function to prepare 
function extractDataToDatasets() {
  const ecgParams = options.electrogramParams;
  const completeDataset = options.completeDataset;
  let sets = [];
  for (let i = 0; i < completeDataset.datasets.length; i++) {
    const channel = completeDataset.datasets[i].label;
    let data_points = completeDataset.datasets[i].data
    sets.push({
      label: channel,
      data: data_points.slice(ecgParams.dataIdxLeft, ecgParams.dataIdxRight),
      borderColor: "black",
    });
  }
  data.datasets = sets;
  data.labels = completeDataset.labels.slice(ecgParams.dataIdxLeft, ecgParams.dataIdxRight).map(element => element.toFixed(2));
  return data;
}


class ApexChart extends React.Component {
  
  constructor(props) {
    super(props);
    this.myChartRef = React.createRef();
    this.state = { 
      zoom_value: 2,
    };
    this.handleZoomChange = this.handleZoomChange.bind(this);
    this.handleClick = this.handleClick.bind(this);

    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      console.log(e);
      const corsair = options.plugins.corsair;
      if(corsair.drawingLine) {
        corsair.annotating = false;
        corsair.drawingLine = false;
        console.log("Adding");
        console.log("Length: " + corsair.annotations.length);
        this.props.setEdited(true);
        this.props.addAnnotation(corsair.annotations[corsair.annotations.length - 1]);
      }
    })
  }

  updateAnnotations() {
    this.myChartRef.current.config.options.plugins.corsair.annotations = this.props.annotations.slice();
  }

  async componentDidMount() {
    // console.log('componentDidMount()');
    window.setTimeout(() => {
      this.updateAnnotations();
      this.updateChartFile();
      this.props.setFileWasUpdated(false);
      this.myChartRef.current.update('none');
    })
  }

  async componentDidUpdate() {
    // console.log('componentDidUpdate()');
    window.setTimeout(() => {
      this.updateAnnotations();
      if (this.props.fileWasUpdated) { 
        this.props.setFileWasUpdated(false);
        console.log("File was Updated");
        this.updateChartFile(); 
      }
      this.myChartRef.current.update('none');
    })
  }

  async updateChartFile () {
    console.log('updateChartFile()');
    options.electrogramParams.dataIdxLeft = 0;
    options.electrogramParams.dataIdxRight = 10000;
    options.electrogramParams.numPointsOnChart = 10000;
    this.myChartRef.current.config.options = options;
    this.setState({zoom_value: 2});
    try {
      // update datasets
      await extractAllDataToDatasets(this.props.currentFileIdx);
      const currentSliceData = extractDataToDatasets();
      this.myChartRef.current.config.data = currentSliceData;

      // update annotations
      console.log("getAnnotationData()");
      let jsonData = await getAnnotationData(this.props.currentFileIdx);
      console.log("got jsonData");
      let annotations = [];
      if (jsonData && jsonData.fileExists) {
        console.log("annotation file exists");
        let annotationJSON = jsonData.data.annotations;
        annotationJSON.forEach(element => {
          const loadedAnnotations = new AnnotationLine(
            this.myChartRef.current, 
            element.idx1,
            element.idx2,
            true,
            element.timeCreated,
            element.comment
          );
          annotations.push();
          this.props.addAnnotation(loadedAnnotations);
        })
      }
      options.plugins.corsair.annotations = annotations;
      this.myChartRef.current.update('none');
      console.log("CHART UPDATED");
      this.props.setLoaderVisible(false);
    } catch (err) {
      console.log(err);
    }
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
    const newNumPoints = Math.round(ecgParams.maxPointsOnChart / zoomLevel);
    ecgParams.numPointsOnChart = newNumPoints;
    
    // get new dataset 0 index array based on center of current window
    // result: zoom in is centered on currently viewed data
    const zoomInTime = config.data.labels[Math.floor(config.data.labels.length / 2)];
    for (let i = 0; i < labels.length; i++) {
      if (labels[i] > zoomInTime) {
        if (i >= newNumPoints/2) {
          // case where zoom in/out doesn't result in negative left side
          console.log(i);
          dataIdxLeft = Math.round(i - newNumPoints/2);
        } else {
          // case where it does
          dataIdxLeft = 0;
        }
        break;
      }
    }

    dataIdxRight = dataIdxLeft + newNumPoints;
    ecgParams.dataIdxLeft = dataIdxLeft;
    ecgParams.dataIdxRight = dataIdxRight;
    config.data = extractDataToDatasets(this.props.currentFileIdx);

    let lbls = config.data.labels;
    console.log(`startIdx: ${dataIdxLeft}, endIdx: ${dataIdxRight}`);
    lbls = lbls.concat(labels.slice(dataIdxLeft, dataIdxRight));
    lbls.splice(0, newNumPoints);
    config.data.labels = lbls;
    config.data.datasets.forEach((dataset, index) => {
      dataset.data = dataset.data.concat(options.completeDataset.datasets[index].data.slice(dataIdxLeft, dataIdxRight));
      dataset.data.splice(0, newNumPoints);
    });
    
    this.myChartRef.current.update('none');
  }

  handleClick(event) {
    console.log(event);
  }

  render() {
    return (
      <div className={styles.chartcontainer} >
        <div onClick={this.handleClick} style={this.props.loaderVisible ? {visibility: "hidden"} : {visibility: "visible", height: '100%', width: '100%'}}>
          <Line 
            ref={this.myChartRef}
            height={"100%"} 
            width={"100%"} 
            options={options}
            plugins={annotationLinePlugin}
            data={initialData} />
        </div>
        <div className={styles['tools-box']}>
          <select value={this.state.zoom_value} onChange={this.handleZoomChange}>
            <option value={8}>400</option>
            <option value={3.8}>200</option>
            <option value={2}>100</option>
            <option value={1}>67</option>
          </select>
          <div className={styles['tools-box-name']}></div>
          <button className={styles['select-buttons']} onClick={() => {
            this.myChartRef.current.config.options.plugins.corsair.annotating = true;
            console.log(this.myChartRef.current.config.options.plugins.corsair);
            }}>✎</button>
          <div>
            <button className={styles['confirm-buttons']} onClick={() => {
              const corsair = this.myChartRef.current.config.options.plugins.corsair;
              if(corsair.drawingLine) {
                corsair.annotating = false;
                corsair.drawingLine = false;
                console.log("Adding");
                console.log("Length: " + corsair.annotations.length);
                this.props.setEdited(true);
                this.props.addAnnotation(corsair.annotations[corsair.annotations.length - 1]);
              }
            }}>✓</button>
            <button className={styles['confirm-buttons']} onClick={() => {
              const corsair = this.myChartRef.current.config.options.plugins.corsair;
              if (corsair.drawingLine) {
                corsair.annotating = false;
                corsair.drawingLine = false;
                corsair.annotations.pop();
                this.myChartRef.current.draw();
              }
            }}>☓</button>
          </div>
        </div>
        {this.props.loaderVisible &&
            <div className={styles['loading-icon']}>
              <BallTriangle
                height="70"
                width="70"
                color="grey"
                ariaLabel="loading-indicator"
              />
            </div>
          }
      </div>
    );
  }
}

export default ApexChart;