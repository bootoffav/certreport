import React, { Component } from 'react';
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
