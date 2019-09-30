import React from 'react';

class SettingsOR extends React.Component<{
  enabled: boolean;
}> {
  state: {
    [key: string]: boolean;
  } = {
    includeCompletedTasks: this.getStateFromLocalStorage('includeCompletedTasks'),
    includeEndedTasks: this.getStateFromLocalStorage('includeEndedTasks'),
    includeTasksWithoutNumbers: this.getStateFromLocalStorage('includeTasksWithoutNumbers')
  }

  getStateFromLocalStorage(label: string): boolean {
    return Boolean(Number(localStorage.getItem(label)));
  }

  toggle = (event: React.SyntheticEvent) => {
    const { id } = event.currentTarget;
    this.setState({
      [id]: !this.state[id]
    }, 
      // sync localStorage
      () => Object.keys(this.state).forEach(key => {
        this.state[key]
          ? localStorage.setItem(key, '1')
          : localStorage.removeItem(key);
      })
    );
  }

  render() {
    return (
      <div className="px-4">
        <input className="form-check-input"
          type="checkbox"
          checked={this.state.includeCompletedTasks}
          id="includeCompletedTasks"
          disabled={!this.props.enabled}
          onChange={this.toggle}
        />
        <label className="form-check-label" htmlFor="includeCompletedTasks">
          Include completed certifications (7. Test-report ready)
          </label><br />
        <input className="form-check-input"
          type="checkbox"
          checked={this.state.includeEndedTasks}
          id="includeEndedTasks"
          disabled={!this.props.enabled}
          onChange={this.toggle}
        />
        <label className="form-check-label" htmlFor="includeEndedTasks">
          Include ended certifications (8. Certificate Ready, 9. Ended)
            </label><br />
        <input className="form-check-input"
          type="checkbox"
          checked={this.state.includeTasksWithoutNumbers}
          id="includeTasksWithoutNumbers"
          disabled={!this.props.enabled}
          onChange={this.toggle}
        />
        <label className="form-check-label" htmlFor="includeTasksWithoutNumbers">
          Include tasks without _Aitex/Satra numbers
          </label><br />
      </div>
    );
  }
}

export default SettingsOR;