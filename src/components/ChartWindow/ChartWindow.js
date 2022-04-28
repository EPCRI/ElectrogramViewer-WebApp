import React from "react";
import styles from './ChartWindow.module.css';
import ApexChart from '../ApexChart/ApexChart';
import { Annotation } from '../Annotation/Annotation';

const traceLeads = ['I','II','III','aVR','aVL','aVF','V1','V2','V3','V4','V5','V6'];

class ChartWindow extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  componentDidUpdate() {
    console.log(this.props.annotations);
  }

  render() {
      return (
        <div className={styles.row}>
          <div className={`${styles.column} ${styles.left}`}>
            Signal
            {traceLeads.map((item, index) => {return <div key={index} className={styles.leadItem}>{item}</div>})}
          </div>
          <div className={`${styles.column} ${styles.middle}`}>
            <ApexChart 
              annotations={this.props.annotations} 
              addAnnotation={this.props.addAnnotation}
              currentFileIdx={this.props.currentFileIdx}
              fileWasUpdated={this.props.fileWasUpdated}
              setFileWasUpdated={this.props.setFileWasUpdated}/>
          </div>
          <div className={`${styles.column} ${styles.right}`}>
            {this.props.annotations.map((element, index) => (
              <Annotation 
                key={index}
                annotation={element} 
                removeAnnotation={this.props.removeAnnotation}
                addComment={this.props.addComment}/>))}
          </div>
        </div>
      );
  }
}

export default ChartWindow;