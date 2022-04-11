import React from 'react';
import ChartWindow from '../ChartWindow/ChartWindow';
import FileUI from '../FileUI/FileUI'
import logo from '../../logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div className="App">
        <h1>EPCRI Elecrogram Annotation Web App</h1>
        <FileUI />
        <ChartWindow />
      </div>
    );
  }
}

export default App;
