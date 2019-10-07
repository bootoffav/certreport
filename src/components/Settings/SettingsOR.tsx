import React from 'react';

export default function SettingsOR(props: {
  enabled: boolean;
  state: any;
  toggle: any;
}) {
  return (
    <div className="px-4">
      <input className="form-check-input"
        type="checkbox"
        checked={props.state.includeCompletedTasks}
        id="includeCompletedTasks"
        disabled={!props.enabled}
        onChange={props.toggle}
      />
      <label className="form-check-label" htmlFor="includeCompletedTasks">
        Include completed certifications (7. Test-report ready)
        </label><br />
      <input className="form-check-input"
        type="checkbox"
        checked={props.state.includeEndedTasks}
        id="includeEndedTasks"
        disabled={!props.enabled}
        onChange={props.toggle}
      />
      <label className="form-check-label" htmlFor="includeEndedTasks">
        Include ended certifications (8. Certificate Ready, 9. Ended)
          </label><br />
      <input className="form-check-input"
        type="checkbox"
        checked={props.state.includeTasksWithoutNumbers}
        id="includeTasksWithoutNumbers"
        disabled={!props.enabled}
        onChange={props.toggle}
      />
      <label className="form-check-label" htmlFor="includeTasksWithoutNumbers">
        Include tasks without _Aitex/Satra numbers
        </label><br />
    </div>
  );
}

