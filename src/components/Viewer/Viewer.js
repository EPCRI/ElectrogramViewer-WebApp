import React from 'react';
import ChartWindow from '../ChartWindow/ChartWindow';
import FileUI from '../FileUI/FileUI';
import { getFileNames, getAnnotationData } from '../../utils/fileIO';
import './Viewer.module.css';

class Viewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentFileIdx: 0,
      fileWasUpdated:true,
      allFiles: [],
      annotations: [],
    }
    this.addComment = this.addComment.bind(this);
    this.addAnnotation = this.addAnnotation.bind(this);
    this.removeAnnotation = this.removeAnnotation.bind(this);
    this.changeFile = this.changeFile.bind(this);
    this.setFileWasUpdated = this.setFileWasUpdated.bind(this);
  }

  setFileWasUpdated(updatedBool) {
    this.setState({fileWasUpdated: updatedBool});
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

  async changeFile (fileIdx) {
    console.log(`Changing file to ${fileIdx}`);
    this.setState({
      currentFileIdx: fileIdx,
      annotations: []
    });
  }

  removeAnnotation (timeCreated) {
    this.setState({annotations: this.state.annotations.filter(annotation => annotation.timeCreated !== timeCreated)});
  }

  componentDidUpdate() {
    console.log(this.state.annotations);
    // console.log(this.state.allFiles);
  }

  async componentDidMount() {  
    try {
      let fileNames = [];
      fileNames = await getFileNames();
      this.setState({ currentFileIdx: 0, allFiles: fileNames });
    } catch(err) {
      console.log(err);
    }

  }

  render(){
    return (
      <div className="App">
        <h1>EPCRI Elecrogram Viewer</h1>
        <FileUI 
          annotations={this.state.annotations}
          changeFile={this.changeFile}
          setFileWasUpdated={this.setFileWasUpdated}
          currentFileIdx={this.state.currentFileIdx}/>
        <ChartWindow 
          currentFileIdx={this.state.currentFileIdx}
          annotations={this.state.annotations} 
          fileWasUpdated={this.state.fileWasUpdated}
          addAnnotation={this.addAnnotation} 
          addComment={this.addComment}
          removeAnnotation={this.removeAnnotation}
          setFileWasUpdated={this.setFileWasUpdated}/>
      </div>
    );
  }
}

export default Viewer;
