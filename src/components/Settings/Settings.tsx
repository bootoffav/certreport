import React from 'react';
import Task, { Stage } from '../../Task/Task';

export class Settings extends React.Component<{
  onClose: () => void;
}> {
  state: {
    [key: string]: boolean
  } = {
    includeCompletedTasks: Boolean(Number(localStorage.getItem('includeCompletedTasks'))),
    includeEndedTasks: Boolean(Number(localStorage.getItem('includeEndedTasks'))),
    includeTasksWithoutNumbers: Boolean(Number(localStorage.getItem('includeTasksWithoutNumbers'))),
    showOnlyOngoingCertifications: Boolean(Number(localStorage.getItem('showOnlyOngoingCertifications'))),
  }

  toggle = (e: React.SyntheticEvent) => {
    const what = e.currentTarget.id;
    if (what) {
      localStorage.setItem(
        what,
        Number(!this.state[what]).toString()
      );
      this.setState(
        { [what]: !this.state[what] },
        () => what === 'showOnlyOngoingCertifications' && this.adjustDependentCheckboxes()
      );
    }
  }

  componentDidMount() {
    this.adjustDependentCheckboxes();
  }

  adjustDependentCheckboxes = () => ['includeCompletedTasks', 'includeEndedTasks', 'includeTasksWithoutNumbers']
    // @ts-ignore
    .forEach(checkbox => document.getElementById(checkbox).disabled = this.state.showOnlyOngoingCertifications);

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
              <input className="form-check-input" type="checkbox" value="" checked={this.state.showOnlyOngoingCertifications} id="showOnlyOngoingCertifications"
                onChange={this.toggle} />
              <label className="form-check-label" htmlFor="showOnlyOngoingCertifications">
                Show Only Ongoing Certifications
              </label><br />
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

export function generalSettingsFilter(tasks: Task[]): Task[] {
  if (Number(localStorage.getItem('showOnlyOngoingCertifications'))) {
    const excludeTheseStages = [
      '00. Paused',
      '0. Sample to be prepared',
      '9. Ended',
      ''
    ];
    return tasks.filter((task: Task) => !excludeTheseStages.includes(task.state.stage));
  }
  if (!Boolean(Number(localStorage.getItem('includeCompletedTasks')))) {
    tasks = tasks.filter((task: Task) => task.state.stage !== Stage[8])
  }
  if (!Boolean(Number(localStorage.getItem('includeEndedTasks')))) {
    tasks = tasks.filter((task: Task) => task.state.stage !== Stage[9]);
  }
  if (!Boolean(Number(localStorage.getItem('includeTasksWithoutNumbers')))) {
    tasks = tasks.filter((task: any) => /\d{3}_/.test(task.TITLE.substring(0, 4)))
  }
  return tasks;
}