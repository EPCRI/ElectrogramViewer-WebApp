import React from 'react';
import ChartWindow from '../ChartWindow/ChartWindow.js';
import logo from '../../logo.svg';
import './App.css';

class App extends React.Component {

  render(){
    return (
      <div className="App">
        <h1>EPCRI Elecrogram Annotation Web App</h1>
        <ChartWindow />
      </div>
    );
  }
}

export default App;
