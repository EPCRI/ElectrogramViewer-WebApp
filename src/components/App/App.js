import React from 'react';
import ChartWindow from '../ChartWindow/ChartWindow';
import FileUI from '../FileUI/FileUI'
import logo from '../../logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {file: "", annotations: []}
    this.addAnnotation = this.addAnnotation.bind(this);
  }

  addAnnotation (annotation) {
    console.log("addAnnotation()");
    this.setState({annotations: [...this.state.annotations, annotation]});
  }

  removeAnnotation (annotationId) {
    
  }

  render(){
    return (
      <div className="App">
        <h1>EPCRI Elecrogram Viewer</h1>
        <FileUI />
        <ChartWindow annotations={this.state.annotations} addAnnotation={this.addAnnotation}/>
      </div>
    );
  }
}

export default App;
