import React from 'react';
import ChartWindow from '../ChartWindow/ChartWindow';
import { Annotation } from '../Annotation/Annotation';
import FileUI from '../FileUI/FileUI';
import { getFileNames, getAnnotationNames } from '../../utils/fileIO';
import styles from './Viewer.module.css';

class Viewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentFileIdx: 0,
      fileWasUpdated:true,
      allFiles: [],
      annotationFiles: [],
      annotations: [],
      loaderVisible: true,
      edited: true,
    }
    this.addComment = this.addComment.bind(this);
    this.addAnnotation = this.addAnnotation.bind(this);
    this.addAnnotationFile = this.addAnnotationFile.bind(this);
    this.removeAnnotationFile = this.removeAnnotationFile.bind(this);
    this.removeAnnotation = this.removeAnnotation.bind(this);
    this.changeFile = this.changeFile.bind(this);
    this.setFileWasUpdated = this.setFileWasUpdated.bind(this);
    this.setLoaderVisible = this.setLoaderVisible.bind(this);
    this.setEdited = this.setEdited.bind(this);
  }

  setFileWasUpdated(updatedBool) {
    this.setState({fileWasUpdated: updatedBool});
  }

  setLoaderVisible(visibleBool) {
    this.setState({loaderVisible: visibleBool});
  }

  setEdited(editedBool) {
    this.setState({edited: editedBool});
  }

  addAnnotationFile(file) {
    const annArr = this.state.annotationFiles;
    annArr.push(file);
    this.setState({annotationFiles: annArr});
  }

  removeAnnotationFile(file) {
    const annArr = this.state.annotationFiles;
    console.log(annArr);
    const updatedAnnArr = annArr.filter(e => e !== file);
    console.log(updatedAnnArr);
    this.setState({annotationFiles: updatedAnnArr});
  }

  addAnnotation (annotation) {
    // console.log("\naddAnnotation()");
    // console.log(annotation);
    this.setState({annotations: [...this.state.annotations, annotation]});
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
    // console.log(this.state.annotations);
    // console.log(this.state.allFiles);
  }

  async componentDidMount() {  
    try {
      const fileNames = await getFileNames();
      const annotationNames = await getAnnotationNames();
      // console.log(annotationNames)
      this.setState({ currentFileIdx: 0, allFiles: fileNames, annotationFiles: annotationNames });
    } catch(err) {
      console.log(err);
    }

  }

  render(){
    return (
      <div className={styles['viewer']} >
        <div className={styles['title-container']}>
          <h1 className={styles['title']}>EPCRI Elecrogram Viewer</h1>
        </div>
        <FileUI 
          annotations={this.state.annotations}
          addAnnotationFile={this.addAnnotationFile}
          removeAnnotationFile={this.removeAnnotationFile}
          changeFile={this.changeFile}
          setLoaderVisible={this.setLoaderVisible}
          loaderVisible={this.state.loaderVisible}
          fileWasUpdated={this.state.fileWasUpdated}
          setFileWasUpdated={this.setFileWasUpdated}
          annotationFiles={this.state.annotationFiles}
          currentFileIdx={this.state.currentFileIdx}
          edited={this.state.edited}
          setEdited={this.setEdited}/>
        <ChartWindow
          currentFileIdx={this.state.currentFileIdx}
          annotations={this.state.annotations}
          fileWasUpdated={this.state.fileWasUpdated}
          addAnnotation={this.addAnnotation}
          addComment={this.addComment}
          removeAnnotation={this.removeAnnotation}
          setFileWasUpdated={this.setFileWasUpdated}
          loaderVisible={this.state.loaderVisible}
          setLoaderVisible={this.setLoaderVisible}
          setEdited={this.setEdited} />
        <div className={`${styles.annotations}`}>
          {this.state.annotations.map((element, index) => (
            <Annotation
              key={index}
              annotation={element}
              removeAnnotation={this.removeAnnotation}
              addComment={this.addComment} />))}
        </div>
      </div>
    );
  }
}

export default Viewer;
