import { Component } from 'react';
// import firebase from '../../../old_code/DB';

interface SerialNumberProps {
  serialNumber: string;
  handleChange: any;
  url: string;
  handleInit: (v: any) => void;
}
// interface ISerialNumber {
//   firebaseCallback: any;
// }

class SerialNumber extends Component<SerialNumberProps> {
  // firebaseCallBack : any;
  // componentDidMount() {
  //   if (this.props.url === '/add') {
  //     this.firebaseCallback = firebase.database().ref().on('value',
  //       data_structure => {
  //         let sn = data_structure ? data_structure.val().serialNumber : '';
  //         return this.props.handleInit(sn);
  //       }
  //     );
  //   }
  // }

  // componentWillUnmount() {
  //   firebase.database().ref().off('value', this.firebaseCallback);
  // }
  // static update(v : any) {
    // firebase.database().ref().update({
    //   serialNumber: v
    // });
  // }

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