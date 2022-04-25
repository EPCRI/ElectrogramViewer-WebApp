import React from 'react';
import ChartWindow from '../ChartWindow/ChartWindow';
import FileUI from '../FileUI/FileUI';
import { getFileNames } from '../../utils/FileInteractions';
import './Viewer.module.css';
// const fs = require('fs');

class Viewer extends React.Component {
  constructor(props) {
    super(props);
    
    getFileNames();

    this.state = {
      currentFileIdx: 0,
      allFiles: [],
      annotations: []
    }
    this.addComment = this.addComment.bind(this);
    this.addAnnotation = this.addAnnotation.bind(this);
    this.removeAnnotation = this.removeAnnotation.bind(this);
    this.changeFile = this.changeFile.bind(this);
  }

  addAnnotation (annotation) {
    console.log("\naddAnnotation()");
    console.log(annotation);
    this.setState({annotations: [...this.state.annotations, annotation]});
    console.log('\n');
  }

  addComment (timeCreated, comment) {
    let annotations = this.state.annotations;
    const annotationIdx = annotations.findIndex(annotation => annotation.timeCreated === timeCreated);
    const annotation = annotations.find(annotation => annotation.timeCreated === timeCreated);
    annotation.comment = comment;
    annotations = annotations.filter(annotation => annotation.timeCreated !== timeCreated);
    annotations.splice(annotationIdx, 0, annotation);
    this.setState({annotations: annotations});
  }

  changeFile (fileIdx) {
    console.log(`Changing file to ${this.state.allFiles[fileIdx]}`);
    this.setState({currentFileIdx: fileIdx});
  }

  removeAnnotation (timeCreated) {
    this.setState({annotations: this.state.annotations.filter(annotation => annotation.timeCreated !== timeCreated)});
  }

  componentDidUpdate() {
    console.log(this.state.annotations);
  }

  render(){
    return (
      <div className="App">
        <h1>EPCRI Elecrogram Viewer</h1>
        <FileUI 
          allFiles={this.state.allFiles}
          currentFileIdx={this.state.currentFileIdx}/>
        <ChartWindow 
          currentFile={this.state.allFiles[this.state.currentFileIdx]}
          annotations={this.state.annotations} 
          addAnnotation={this.addAnnotation} 
          addComment={this.addComment}
          removeAnnotation={this.removeAnnotation}/>
      </div>
    );
  }
}

export default Viewer;
