import React from 'react';


class Settings extends React.Component<{
  onClose: () => void;
  toggle: () => void;
  checked: boolean;
  }, {}> {

  render() {
    return <>
      <button type="button" className="btn btn-default" data-toggle="modal" data-target="#modal-settings">
        <span className="oi oi-cog"></span>
      </button>
      <div className="modal fade" id="modal-settings" tab-index="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">General settings</h5>
            </div>
            <div className="modal-body">
               &nbsp; &nbsp;
                <input className="form-check-input" type="checkbox" value="" checked={this.props.checked} id="defaultCheck1" onChange={this.props.toggle}/>
                  <label className="form-check-label" htmlFor="defaultCheck1">
                    Show completed certifications
                  </label>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.props.onClose}>Save</button>
            </div>
          </div>
        </div>
      </div>
      
    </>;
  }
}

export default Settings;