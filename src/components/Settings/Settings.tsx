import React from 'react';
import Task, { Stage } from '../../Task/Task';
import SettingsOR from './SettingsOR';

export class Settings extends React.Component<{
  onClose: () => void;
}> {

  getStateFromLocalStorage(label: string): boolean {
    return Boolean(Number(localStorage.getItem(label)));
  }

  state: {
    [key: string]: boolean
  } = {
    settingsOR: this.getStateFromLocalStorage('settingsOR'),
    showOnlyOngoingCertifications: this.getStateFromLocalStorage('showOnlyOngoingCertifications'),
    showOnlyFailedCertifications: this.getStateFromLocalStorage('showOnlyFailedCertifications'),
  }

  toggle = (event: React.SyntheticEvent) => {
    const { id } = event.currentTarget as HTMLInputElement;
    this.setState((state: any) => {
      Object.keys(state).forEach(key => state[key] = id === key);
      return state;
    });
  }

  save = () => {
    Object.keys(this.state).forEach(key => {
      this.state[key]
        ? localStorage.setItem(key, '1')
        : localStorage.removeItem(key);
    });
    this.props.onClose();
  }

  reset() {
    [ 'showOnlyOngoingCertifications', 'showOnlyFailedCertifications',
      'settingsOR', 'includeCompletedTasks', 'includeEndedTasks',
      'includeTasksWithoutNumbers'
    ].forEach(item => localStorage.removeItem(item));


    // state
    this.setState((state: any) => {
      Object.keys(state).forEach((k: any) => state[k] = false);
      return state;
    });
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
              <h5 className="modal-title mx-auto" id="exampleModalLabel">General settings</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-check">
                <input className="form-check-input" type="radio"
                  name="generalSettings" id="showOnlyOngoingCertifications"
                  checked={this.state.showOnlyOngoingCertifications}
                  onChange={this.toggle.bind(this)}
                />
                <label className="form-check-label" htmlFor="showOnlyOngoingCertifications">
                  Show Only Ongoing Certifications
                </label>
              </div>
              <hr />
              
              <div className="form-check">
                <input className="form-check-input" type="radio"
                  name="generalSettings" id="showOnlyFailedCertifications"
                  checked={this.state.showOnlyFailedCertifications} 
                  onChange={this.toggle.bind(this)}
                />
                <label className="form-check-label" htmlFor="showOnlyFailedCertifications">
                  Show Only Failed Certifications
                </label>
              </div>
              <hr />

              <div className="form-check">
                <input className="form-check-input" type="radio"
                  name="generalSettings" id="settingsOR"
                  checked={this.state.settingsOR}
                  onChange={this.toggle.bind(this)}
                />
                <label className="form-check-label" htmlFor="OR">
                  OR:
                </label>
              </div>
              <div className="px-4">
                <SettingsOR enabled={this.state.settingsOR}/>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={(e) => this.reset()}>Reset</button>
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.save}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </>;
  }
}

export function generalSettingsFilter(tasks: Task[]) {

  if (Number(localStorage.getItem('settingsOR'))) {

    const filters: any = {
      includeCompletedTasks: (tasks: any) => tasks.filter(({ state }: Task) => state.stage !== Stage[8]),
      includeEndedTasks: (tasks: any) => tasks.filter(({ state }: Task) => 
        state.stage !== Stage[9] && state.stage !== Stage[10]
      ),
      includeTasksWithoutNumbers: (tasks: any) => tasks.filter(({ TITLE }: any) => /\d{3}_/.test(TITLE.substring(0, 4)))
    };

    const filterRules: any = {
      includeCompletedTasks: Number(localStorage.getItem('includeCompletedTasks')),
      includeEndedTasks: Number(localStorage.getItem('includeEndedTasks')),
      includeTasksWithoutNumbers: Number(localStorage.getItem('includeTasksWithoutNumbers'))
    };

    for (let rule in filterRules) {
      if (!filterRules[rule]) (tasks = filters[rule](tasks));
    }

    return tasks;
  }
  
  if (Number(localStorage.getItem('showOnlyOngoingCertifications'))) {
    const excludeTheseStages = [
      '00. Paused',
      '0. Sample to be prepared',
      '9. Ended',
      ''
    ];
    return tasks.filter((task: Task) => !excludeTheseStages.includes(task.state.stage));
  }
  
  if (Number(localStorage.getItem('showOnlyFailedCertifications'))) {
    return tasks.filter((task: any) => task.state.resume === 'fail');
  }

  return tasks;
}