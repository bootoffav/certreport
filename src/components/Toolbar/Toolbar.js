import React from 'react';
import 'bootstrap';
import m from 'moment';

const Toolbar = props =>
  (<div className="row">
    <div className="col btn-group btn-group-toggle" data-toggle="buttons">
      <label
        className="btn btn-warning btn-sm active"
        onClick={() => props.onClick('all')}
      ><input type="radio"/>All</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => props.onClick('sentOn')}
      ><input type="radio"/>Sample's sent</label>
      {/* <label
        className="btn btn-secondary btn-sm"
        // onClick={this.handleClick}
      ><input type="radio" disabled/>Proforma received</label> */}
      <label
        className="btn btn-warning btn-sm"
        onClick={() => props.onClick('paid')}
      ><input type="radio" />Payment Done</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => props.onClick('finishedOn')}
      ><input type="radio"/>Delivery Date announced</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => props.onClick('thisMonth')}
      ><input type="radio"/>Tests to be ready this month</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => props.onClick('missingTestReport')}
      ><input type="radio"/>Missing rest report</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => props.onClick('waitingCertificate')}
      ><input type="radio"/>Waiting for certificate</label>
    </div>
  </div>);

const filter = (prop, tasks) => {
  const sentOnTasks = () => tasks.filter(task => task.state.sentOn);

  switch (prop) {
    case 'sentOn':
      return sentOnTasks();
    case 'finishedOn':
      return tasks.filter(task => task.state.finishedOn);
    case 'paid':
      return tasks.filter(task => task.state.paid);
    case 'thisMonth':
      const currentDate = m();
      return tasks.filter(task => {
        if (task.state.finishedOn) {
          const date = m(task.state.finishedOn, 'DDMMMYYY');
          return currentDate.month() === date.month() && currentDate.year() === date.year();
        }
        return false;
      });
    case 'missingTestReport':
      return sentOnTasks().filter(task => !task.state.testReport.includes('.pdf'));
    case 'waitingCertificate':
      return sentOnTasks().filter(task => !task.state.certificate.includes('.pdf'));
    default:
      return tasks;
  }
};


export { Toolbar, filter };