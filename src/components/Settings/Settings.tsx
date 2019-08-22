import React from 'react';
import { render } from 'react-dom';
import { string } from 'prop-types';

export class Settings extends React.Component<{
  onClose: () => void;
}> {
  state = {
    includeCompletedTasks: Boolean(Number(localStorage.getItem('includeCompletedTasks'))),
    includeEndedTasks: Boolean(Number(localStorage.getItem('includeEndedTasks'))),
    includeTasksWithoutNumbers: Boolean(Number(localStorage.getItem('includeTasksWithoutNumbers'))),
  }
  
  toggle = (e: React.SyntheticEvent) => {
    const what = e.currentTarget.id;
    if (what) {
      localStorage.setItem(
        what,
        // @ts-ignore
        Number(!this.state[what]).toString()
        );
        // @ts-ignore
        this.setState({ [what]: !this.state[what] });
    }
  }

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
              <input className="form-check-input" type="checkbox" value="" checked={this.state.includeCompletedTasks} id="includeCompletedTasks" onChange={this.toggle} />
              <label className="form-check-label" htmlFor="includeCompletedTasks">
                Include completed certifications
              </label><br />
              &nbsp; &nbsp;
              <input className="form-check-input" type="checkbox" value="" checked={this.state.includeEndedTasks} id="includeEndedTasks" onChange={this.toggle} />
              <label className="form-check-label" htmlFor="includeEndedTasks">
                Include ended certifications
                </label><br />
              &nbsp; &nbsp;
              <input className="form-check-input" type="checkbox" value="" checked={this.state.includeTasksWithoutNumbers} id="includeTasksWithoutNumbers" onChange={this.toggle} />
              <label className="form-check-label" htmlFor="includeTasksWithoutNumbers">
                Include tasks without _Aitex/Satra numbers
                </label><br />
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