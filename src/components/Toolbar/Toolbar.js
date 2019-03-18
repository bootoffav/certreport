import React from 'react';
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
      <label
        className="btn btn-warning btn-sm"
        onClick={() => props.onClick('proforma')}
      ><input type="radio"/>Proforma received</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => props.onClick('paid')}
      ><input type="radio" />Payment Done</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => props.onClick('deliveryDateAnnounced')}
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

const filter = (tasks, prop) => {
  let filteredTasks;
  const sentOnTasks = () => tasks.filter(task => task.state.sentOn);

  switch (prop) {
    case 'sentOn':
      filteredTasks = sentOnTasks();
      break;
    case 'deliveryDateAnnounced':
      filteredTasks = tasks.filter(task => !task.state.testReport.toLowerCase().includes('.pdf'));
      break;
    case 'paid':
      filteredTasks = tasks.filter(task => task.state.paid);
      break;
    case 'proforma':
      filteredTasks = tasks.filter(task => task.state.proformaReceived);
      break;
    case 'thisMonth':
      const currentDate = m();
      filteredTasks = tasks.filter(task => {
        if (task.state.finishedOn) {
          const date = m(task.state.finishedOn, 'DDMMMYYY');
          return currentDate.month() === date.month() && currentDate.year() === date.year();
        }
        return false;
      });
      break;
    case 'missingTestReport':
      filteredTasks = sentOnTasks().filter(task => !task.state.testReport.includes('.pdf'));
      break;
    case 'waitingCertificate':
      filteredTasks = sentOnTasks()
                        .filter(task => task.state.testReport.includes('.pdf')
                        && !task.state.certificate.includes('.pdf'));
      break;
    default:
      filteredTasks = tasks;
    }

  // пронумеровать
  let i = 1;
  filteredTasks.forEach(el => el.position = i++);
  return filteredTasks;
};


export { Toolbar, filter };