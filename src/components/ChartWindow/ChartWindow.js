import React from "react";
import './ChartWindow.css';
import ApexChart from '../ApexChart/ApexChart.js'

const traceLeads = ['I','II','III','aVR','aVL','aVF','V1','V2','V3','V4','V5','V6'];

class ChartWindow extends React.Component {

    render() {
        return (
          <div className="row">
            <div className="column left">
              Signal
              {traceLeads.map(item => {return <div className="leadItem">{item}</div>})}
            </div>
            <div className="column middle">
              <ApexChart />
            </div>
            <div className="column right">
              Annotations
            </div>
          </div>
        );
    }
}

export default ChartWindow;