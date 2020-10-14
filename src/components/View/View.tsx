import { Component } from 'react';

class View extends Component {
  renderHeader = () => (
    <div className="d-flex justify-content-around m-4">
      <button className="btn btn-sm btn-info disabled">
        Test Application Form
      </button>
      <button className="btn btn-sm btn-info">Edit</button>
    </div>
  );

  render = () => <div className="container">{this.renderHeader()}</div>;
}

export default View;
