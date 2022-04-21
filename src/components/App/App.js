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
    this.removeAnnotation = this.removeAnnotation.bind(this);
  }

  addAnnotation (annotation) {
    console.log("\naddAnnotation()");
    console.log(annotation);
    this.setState({annotations: [...this.state.annotations, annotation]});
    console.log(this.state.annotations);
    console.log('\n');
  }

  removeAnnotation (timeCreated) {
    this.setState({annotations: this.state.annotations.filter(annotation => annotation.timeCreated != timeCreated)});
  }

  render(){
    return (
      <div className="App">
        <h1>EPCRI Elecrogram Viewer</h1>
        <FileUI />
        <ChartWindow annotations={this.state.annotations} addAnnotation={this.addAnnotation} removeAnnotation={this.removeAnnotation}/>
      </div>
    );
  }
}

export default App;
