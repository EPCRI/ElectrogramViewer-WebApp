import React from "react";
import styles from './ChartWindow.module.css';
import ApexChart from '../ApexChart/ApexChart';
import { Annotation } from '../Annotation/Annotation';
import { ThrowStatement } from "requirejs";

const traceLeads = ['I','II','III','aVR','aVL','aVF','V1','V2','V3','V4','V5','V6'];

class ChartWindow extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  componentDidUpdate() {
    // console.log(this.props.annotations);
  }

  render() {
      return (
        <div className={styles.row}>
          <div className={`${styles.column} ${styles.left}`}>
            {traceLeads.map((item, index) => {return <div key={index} className={styles.leadItem}>{item}</div>})}
          </div>
          <div className={`${styles.column} ${styles.middle}`}>
            <ApexChart 
              annotations={this.props.annotations} 
              addAnnotation={this.props.addAnnotation}
              currentFileIdx={this.props.currentFileIdx}
              fileWasUpdated={this.props.fileWasUpdated}
              setFileWasUpdated={this.props.setFileWasUpdated}
              loaderVisible={this.props.loaderVisible}
              setLoaderVisible={this.props.setLoaderVisible}
              setEdited={this.props.setEdited}/>
          </div>
        </div>
      );
  }
}

export default ChartWindow;