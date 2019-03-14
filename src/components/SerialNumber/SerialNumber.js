import React from 'react';
import firebase from '../../DB.js';

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
      <>
        Serial number:
        <input required
        className="form-control"
        type="text"
        id="serialNumber"
        placeholder="Loading ..."
        value={this.props.serialNumber}
        onChange={this.props.handleChange}/>
      </>
    );
  }
}

export default SerialNumber;