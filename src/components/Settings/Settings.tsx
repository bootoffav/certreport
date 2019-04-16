import React from 'react';

export const Settings: React.FunctionComponent<{
  onClose: () => void;
  toggle: () => void;
  checked: boolean;
  }> = (props) => {
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
                <input className="form-check-input" type="checkbox" value="" checked={props.checked} id="defaultCheck1" onChange={props.toggle}/>
                  <label className="form-check-label" htmlFor="defaultCheck1">
                    Show completed certifications
                  </label>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={props.onClose}>Save</button>
            </div>
          </div>
        </div>
      </div>
      
    </>;
  }