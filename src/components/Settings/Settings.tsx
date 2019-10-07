import React from 'react';
import Task, { Stage } from '../../Task/Task';
import SettingsOR from './SettingsOR';

type IState = {
  settingsOR: boolean;
  showOnlyOngoingCertifications: boolean;
  showOnlyFailedCertifications: boolean;
  OR: {
    includeCompletedTasks: boolean;
    includeEndedTasks: boolean;
    includeTasksWithoutNumbers: boolean;
    [key: string]: any;
  },
  [key: string]: any;
};

export class Settings extends React.Component<{
  onClose: () => void;
}> {

  getStateFromLocalStorage(label: string): boolean {
    return Boolean(Number(localStorage.getItem(label)));
  }

  state: IState = {
    settingsOR: this.getStateFromLocalStorage('settingsOR'),
    showOnlyOngoingCertifications: this.getStateFromLocalStorage('showOnlyOngoingCertifications'),
    showOnlyFailedCertifications: this.getStateFromLocalStorage('showOnlyFailedCertifications'),
    OR: {
      includeCompletedTasks: this.getStateFromLocalStorage('includeCompletedTasks'),
      includeEndedTasks: this.getStateFromLocalStorage('includeEndedTasks'),
      includeTasksWithoutNumbers: this.getStateFromLocalStorage('includeTasksWithoutNumbers')
    }
  }

  toggle = (event: React.SyntheticEvent) => {
    const { id } = event.currentTarget as HTMLInputElement;
    this.setState((state: any) => {
      Object.keys(state).forEach(key => {
        if (key === 'OR') return;
        state[key] = id === key
      });
      return state;
    });
  }

  toggleOR = (e: any) => {
    const { id, checked } = e.currentTarget;
    this.setState(
      (state: IState) => state.OR[id] = checked,
      () => Object.keys(this.state.OR).forEach(key => {
        this.state.OR[key]
          ? localStorage.setItem(key, '1')
          : localStorage.removeItem(key);
      })
    );
  }

  save = () => {
    Object.keys(this.state).forEach(key => {
      if (key === 'OR') return;
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

    this.setState((state: IState) => {
      Object.keys(state).forEach((k: string) => {
        if (k === 'OR') return;
        state[k] = false
      });
      state.OR.includeCompletedTasks = false;
      state.OR.includeEndedTasks = false;
      state.OR.includeTasksWithoutNumbers = false;
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
                  onChange={this.toggle}
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
                  onChange={this.toggle}
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
                  onChange={this.toggle}
                />
                <label className="form-check-label" htmlFor="OR">
                  OR:
                </label>
              </div>
              <div className="px-4">
                <SettingsOR enabled={this.state.settingsOR}
                  toggle={this.toggleOR}
                  state={this.state.OR} />
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