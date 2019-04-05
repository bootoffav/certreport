import React from 'react';
import m, { Moment } from 'moment';
import Task, { Stage } from '../../Task';

interface Props {
  onClick: (toolBarProp: Stage | undefined) => void;
}

class Toolbar extends React.Component<Props> {
  // filter: (tasks: Task[], prop: Stage | undefined) => Task[];
  render() {
    return (<div className="row">
      <div className="col btn-group btn-group-toggle" data-toggle="buttons">
        <label
          className="btn btn-info btn-sm active"
          onClick={() => this.props.onClick(undefined)}
        ><input type="radio" />All</label>
        <label
          className="btn btn-warning btn-sm"
          onClick={() => this.props.onClick(Stage['Preparing Sample'])}
        ><input type="radio" />0. Preparing sample</label>
        <label
          className="btn btn-warning btn-sm"
          onClick={() => this.props.onClick(Stage['Sample Sent'])}
        ><input type="radio" />1. Sample sent</label>
        <label
          className="btn btn-warning btn-sm"
          onClick={() => this.props.onClick(Stage['Sample Arrived'])}
        ><input type="radio" />2. Sample arrived</label>
        <label
          className="btn btn-warning btn-sm"
          onClick={() => this.props.onClick(Stage['PI Issued'])}
        ><input type="radio" />3. PI Issued</label>
        <label
          className="btn btn-warning btn-sm"
          onClick={() => this.props.onClick(Stage['Payment Done'])}
        ><input type="radio" />4. Payment Done</label>
        <label
          className="btn btn-warning btn-sm"
          onClick={() => this.props.onClick(Stage['Tests are in progress'])}
        ><input type="radio" />5. Laboratory is performing tests</label>
        <label
          className="btn btn-warning btn-sm"
          onClick={() => this.props.onClick(Stage['Test-report ready'])}
        ><input type="radio" />6. Test-report ready</label>
        <label
          className="btn btn-warning btn-sm"
          onClick={() => this.props.onClick(Stage['Certificate ready'])}
        ><input type="radio" />7. Certificate ready</label>
      </div>
    </div>);
  }

  static filter = (tasks: Task[], requiredStage: Stage | undefined = undefined, i = 1) =>
    requiredStage !== undefined
      ? tasks
          .filter(t => t.stage === requiredStage)
          .map(t => {
            t.position = i++;
            return t;
          })
      : tasks.map(t => {
        t.position = i++;
        return t;
      });
}



export { Toolbar };