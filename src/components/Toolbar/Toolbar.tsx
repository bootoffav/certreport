import React from 'react';
import m, { Moment } from 'moment';
import Task from '../../Task';

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
      ><input type="radio"/>All</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => this.props.onClick('preparingSample')}
      ><input type="radio"/>0. Preparing sample</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => this.props.onClick('sentOn')}
      ><input type="radio"/>1. Sample sent</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => this.props.onClick('receivedOn')}
      ><input type="radio"/>2. Sample arrived</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => this.props.onClick('PIIssued')}
      ><input type="radio"/>3. PI Issued</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => this.props.onClick('paid')}
      ><input type="radio" />4. Payment Done</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => this.props.onClick('isInProgress')}
      ><input type="radio"/>5. Laboratory is performing tests</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => this.props.onClick('resultsReceived')}
      ><input type="radio"/>6. Results ready</label>
      <label
        className="btn btn-info btn-sm"
        onClick={() => this.props.onClick('thisMonth')}
      ><input type="radio"/>Tests to be ready this month</label>
      <label
        className="btn btn-info btn-sm"
        onClick={() => this.props.onClick('missingTestReport')}
      ><input type="radio"/>Missing rest report</label>
      <label
        className="btn btn-info btn-sm"
        onClick={() => this.props.onClick('waitingCertificate')}
      ><input type="radio"/>Waiting for certificate</label>
    </div>
  </div>);
  }

  static filter = (tasks: Task[], prop : string) => {
    let filteredTasks;
    const sentOnTasks = () => tasks.filter(task => task.state.sentOn);
  
    switch (prop) {
      case 'preparingSample':
        filteredTasks = tasks.filter(task => !task.state.sentOn && task.state.readyOn);
        break;
      case 'sentOn':
        filteredTasks = sentOnTasks().filter(task => !task.state.receivedOn);
        break;
      case 'receivedOn':
        filteredTasks = tasks.filter(task => task.state.receivedOn && !task.state.proformaReceived);
        break;
      case 'PIIssued':
        filteredTasks = tasks.filter(task => task.state.proformaReceived && !task.state.paid);
        break;
      case 'paid':
        filteredTasks = tasks.filter(task => task.state.paid && !task.state.finishedOn);
        break;
      case 'isInProgress':
        filteredTasks = tasks.filter(task => task.state.finishedOn && !task.state.resultsReceived);
        break;
      case 'resultsReceived':
        filteredTasks = tasks.filter(task => task.state.resultsReceived);
        break;
      case 'thisMonth':
        const currentDate : Moment = m();
        filteredTasks = tasks.filter(task => {
          if (task.state.finishedOn) {
            const date : Moment = m(task.state.finishedOn);
            return currentDate.month() === date.month() && currentDate.year() === date.year();
          }
        });
        break;
      case 'missingTestReport':
        filteredTasks = tasks.filter(task => task.state.resultsReceived && !task.state.testReport.toLowerCase().includes('.pdf'));
        break;
      case 'waitingCertificate':
        filteredTasks = tasks.filter(task => task.state.resultsReceived
                          && task.state.testReport.toLowerCase().includes('.pdf')
                          && !task.state.certificate.toLowerCase().includes('.pdf'));
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