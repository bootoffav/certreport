import React from 'react';
import m, { Moment } from 'moment';
import Task, { Stage } from '../../Task';

interface Props {
  onClick: (toolBarProp: string) => void
}

class Toolbar extends React.Component<Props> {
  render() {
    return (<div className="row">
      <div className="col btn-group btn-group-toggle" data-toggle="buttons">
        <label
          className="btn btn-info btn-sm active"
          onClick={() => this.props.onClick('all')}
        ><input type="radio" />All</label>
        <label
          className="btn btn-warning btn-sm"
          onClick={() => this.props.onClick('Preparing Sample')}
        ><input type="radio" />0. Preparing sample</label>
        <label
          className="btn btn-warning btn-sm"
          onClick={() => this.props.onClick('Sample Sent')}
        ><input type="radio" />1. Sample sent</label>
        <label
          className="btn btn-warning btn-sm"
          onClick={() => this.props.onClick('Sample Arrived')}
        ><input type="radio" />2. Sample arrived</label>
        <label
          className="btn btn-warning btn-sm"
          onClick={() => this.props.onClick('PI Issued')}
        ><input type="radio" />3. PI Issued</label>
        <label
          className="btn btn-warning btn-sm"
          onClick={() => this.props.onClick('Payment Done')}
        ><input type="radio" />4. Payment Done</label>
        <label
          className="btn btn-warning btn-sm"
          onClick={() => this.props.onClick('Tests are In Progress')}
        ><input type="radio" />5. Laboratory is performing tests</label>
        <label
          className="btn btn-warning btn-sm"
          onClick={() => this.props.onClick('Test-report ready')}
        ><input type="radio" />6. Test-report ready</label>
        <label
          className="btn btn-warning btn-sm"
          onClick={() => this.props.onClick('Certificate ready')}
        ><input type="radio" />7. Certificate ready</label>
      </div>
    </div>);
  }

  static filter = (tasks: Task[], prop: string) => {
    let filteredTasks;
    const sentOnTasks = () => tasks.filter(task => task.state.sentOn);

    switch (prop) {
      case 'Preparing Sample':
        filteredTasks = tasks.filter(task => task.stage === Stage['Preparing Sample']);
        break;
      case 'Sample Sent':
        filteredTasks = tasks.filter(task => task.stage === Stage['Sample Sent']);
        break;
      case 'Sample Arrived':
        filteredTasks = tasks.filter(task => task.stage === Stage['Sample Arrived']);
        break;
      case 'PI Issued':
        filteredTasks = tasks.filter(task => task.stage === Stage['PI Issued']);
        break;
      case 'Payment Done':
        filteredTasks = tasks.filter(task => task.stage === Stage['Payment Done']);
        break;
      case 'Tests are In Progress':
        filteredTasks = tasks.filter(task => task.stage === Stage['Tests are In Progress']);
        break;
      case 'Test-report ready':
        filteredTasks = tasks.filter(task => task.stage === Stage['Test-report ready']);
        break;
      case 'Certificate ready':
        filteredTasks = tasks.filter(task => task.stage === Stage['Certificate ready']);
        break;
      default:
        filteredTasks = tasks;
    }

    // пронумеровать
    let i = 1;
    filteredTasks.forEach(el => el.position = i++);
    return filteredTasks;
  };
}



export { Toolbar };