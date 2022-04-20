import React from "react";
import './ChartWindow.css';
import ApexChart from '../ApexChart/ApexChart.js'

const traceLeads = ['I','II','III','aVR','aVL','aVF','V1','V2','V3','V4','V5','V6'];

class ChartWindow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
      return (
        <div className="row">
          <div className="column left">
            Signal
            {traceLeads.map(item => {return <div className="leadItem">{item}</div>})}
          </div>
          <div className="column middle">
            <ApexChart addAnnotation={this.props.addAnnotation}/>
          </div>
          <div className="column right">
            {this.props.annotations.map(element => <div>{element.idx1} - {element.idx2}</div>)}

          </div>
        </div>
      );
  }
}

export default ChartWindow;