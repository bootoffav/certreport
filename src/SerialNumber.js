import React from 'react';
import firebase from './DB.js';

class SerialNumber extends React.Component {
  componentDidMount() {
    if (this.props.url === '/add') {
      this.firebaseCallback = firebase.database().ref().on('value',
        data_structure => this.props.handleInit(data_structure.val().serialNumber)
      );
    }
  }
  componentWillUnmount() {
    firebase.database().ref().off('value', this.firebaseCallback);
  }
  static update(v) {
    firebase.database().ref().update({
      serialNumber: v
    });
  }
  render() {
    return (
      <div className="col-md-2">
        Serial number:
        <input required
        className="form-control"
        type="number"
        id="serialNumber"
        value={this.props.serialNumber}
        onChange={this.props.handleChange}/>
      </div>
    );
  }

}

export default SerialNumber;