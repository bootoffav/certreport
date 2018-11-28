import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Form from './Form.js';
import Navigation from './Navigation.js'

class App extends Component {
  render() {
    return (
      <div className="container">
        <div row="col-md-12">
          <Navigation />
        </div>
      </div>
    )
  }
}

export default App;
