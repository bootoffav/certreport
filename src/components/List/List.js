import './List.css';
import React from 'react';
import Loader from 'react-loader-spinner';
import ReactTable from "react-table";
import { Link } from 'react-router-dom';
import { empty_state } from '../../defaults';
import B24 from '../../B24.js';
import '../../css/style.css';
import { parseDates } from '../../Helpers';
import { Toolbar, filter } from '../Toolbar/Toolbar';
import { Export } from '../Export/Export';

export default class List extends React.Component {
    state = {};
    columns = [{
      Header: '#',
      id: 'position',
      accessor: 'position',
      width: 40
    },{
      Header: '##',
      id: 'serialNumber',
      accessor: row => row.state.serialNumber ? Number(row.state.serialNumber) : '',
      width: 55,
      Cell: props => <a 
        href={`https://xmtextiles.bitrix24.ru/company/personal/user/460/tasks/task/view/${props.original.ID}/`}
        target="_blank" rel="noopener noreferrer"
        >
          { props.value }
        </a>
    }, {
      Header: 'Brand',
      id: 'brand',
      minWidth: 50,
      accessor: row => row.state.brand.length === 0 ? '' : row.state.brand[0].label
    },{
      Header: 'Task name',
      accessor: 'TITLE',
      id: 'taskName',
      minWidth: 550,
      Cell: props => {
        return props.original.state.serialNumber
        ? <Link to={{
            pathname: `/edit/${props.original.ID}`,
            state: {
              ...props.original.state,
              finishedOn: props.original.state.finishedOn ? props.original.state.finishedOn.valueOf() : null,
              sentOn: props.original.state.sentOn ? props.original.state.sentOn.valueOf() : null,
              receivedOn: props.original.state.receivedOn ? props.original.state.receivedOn.valueOf() : null,
              resultsReceived: props.original.state.resultsReceived ? props.original.state.resultsReceived.valueOf() : null,
              startedOn: props.original.state.startedOn ? props.original.state.startedOn.valueOf() : null,
              paymentDate: props.original.state.paymentDate ? props.original.state.paymentDate.valueOf() : null,
            }
          }}
          >{ props.value }</Link>
          : <Link to={{
            pathname: `/edit/${props.original.ID}`,
            state: { ...props.original.state }
          }}>{ props.value }</Link>
      }
    }, {
      Header: 'Sent On',
      accessor: 'state.sentOn',
      id: 'sentOn',
      width: 95,
      Cell: props => props.value ? props.value.format("DD MMM YYYY") : ''
    }, {
      Header: 'Proforma date',
      accessor: 'state.proformaReceivedDate',
      id: 'proformaReceivedDate',
      show: false,
      width: 130,
    }, {
      Header: 'Proforma #',
      accessor: 'state.proformaNumber',
      id: 'proformaNumber',
      show: false,
      width: 100,
    }, {
      Header: 'Paid',
      id: 'paid',
      accessor: row => row.state.paymentDate,
      minWidth: 40,
      Cell: props => props.value 
              ? <span className="oi oi-check"></span>
              : ''
    }, {
      Header: 'Fabric',
      id: 'article',
      accessor: 'state.article',
      width: 100
    }, {
      Header: 'Test report',
      id: 'testReport',
      accessor: 'state.testReport',
      minWidth: 100,
    }, {
      Header: 'Certificate',
      id: 'certificate',
      accessor: 'state.certificate',
      minWidth: 100,
    }, {
      Header: 'Standards',
      id: 'standards',
      accessor: 'state.standards',
      minWidth: 100,
      Cell: props => props.value.length === 0 ? '' : props.value.map(el => `${el.label} `)
    }, {
      Header: 'Price, €',
      Footer: () => <>Total € <span style={{ float: 'right' }}>{this.formatPrice(this.state.totalPrice)}</span></>,
      id: 'price',
      accessor: row => Number(row.state.price),
      minWidth: 90,
    Cell: props => <>€<span style={{ float: 'right' }}>{this.formatPrice(props.value)}</span></>
    }];

  formatPrice = price => Number(price)
    .toLocaleString('en-US', {
      style: 'currency',
      currency: 'EUR'
    })
    .replace(/,/g, ' ')
    .replace(/\./g, ',')
    .substr(1);

  loadFromCache = () => {
    const tasks = sessionStorage.getItem('tasks');

    if (tasks) {
      let tasks = JSON.parse(sessionStorage.getItem('tasks'))
        .map(task => {
          task.state = { ...task.state, ...parseDates(task.state, 'YYYY-MM-DD') };
          return task;
        });
      let allTasks = tasks;
      let filteredTasksLevel1 = tasks;
      let visibleTasks = filter(tasks);
      let totalPrice = visibleTasks.reduce((sum, task) => sum + Number(task.state.price), 0);
      this.setState({ allTasks, visibleTasks, filteredTasksLevel1, totalPrice });
    } else {
      throw new Error('Nothing in cache');
    }
  }

  componentDidMount() {
    try {
      return this.loadFromCache();
    } catch {
      B24.get_tasks()
        .then(tasks => {
          let filtered = {
            new: [],
            old: []
          };
          tasks.forEach(task => (task.CREATED_BY === '460') ? filtered.new.push(task) : filtered.old.push(task))
          return filtered;
        })
        .then(async filtered => {
          let task, tasks = [];

          for (let i = 0; i < filtered.new.length; i++) {
            task = await B24.get_task(filtered.new[i].ID);
            tasks.push(task);
          }
          filtered.old.forEach(task => {
            task.state = { ...empty_state };
            task.state.otherTextInDescription = '\n' + task.DESCRIPTION;
            task.state.UF_CRM_TASK = task.UF_CRM_TASK;
          });
          tasks = tasks.concat(filtered.old);
          return tasks;
        }).then(tasks => {
            let allTasks = tasks;
            let filteredTasksLevel1 = tasks;
            let visibleTasks = filter(tasks);
            let totalPrice = visibleTasks.reduce((sum, task) => sum + Number(task.state.price), 0);
            this.setState({ allTasks, filteredTasksLevel1, visibleTasks, totalPrice });
            sessionStorage.setItem('tasks', JSON.stringify(tasks, (k, v) => [
              'sentOn',
              'receivedOn',
              'startedOn',
              'finishedOn',
              'resultsReceived', 'paymentDate'
              ].includes(k) && v !== undefined && v !== null ? v.substr(0, 10) : v
            ));
        });
    }
  }

  //level 1 filter
  brandFilter(brand) {
    document.getElementById('brandFilter').innerText = `Brands: ${brand}`;
    let filtered;

    switch (brand) {
      case 'All':
        filtered = this.state.allTasks;
        break;
      case 'No brand':
        filtered = this.state.allTasks.filter(task => task.state.brand[0] ? task.state.brand[0].label === brand : true);
        break;
      default:
        filtered = this.state.allTasks.filter(task => task.state.brand[0] ? task.state.brand[0].label === brand : false);
    }

    this.setState({ filteredTasksLevel1: filtered }, () => {
      this.toolbarFilter();
      Array.from(document.getElementsByClassName('btn btn-warning btn-sm'))
        .forEach(el => el.className = 'btn btn-warning btn-sm');
      document.getElementsByClassName('btn btn-warning btn-sm')[0].className += ' active';
    });
  }

  //level 2 filter
  toolbarFilter = (prop = 'all') => {
    let visibleTasks = filter(this.state.filteredTasksLevel1, prop);
    let totalPrice = visibleTasks.reduce((sum, task) => sum + Number(task.state.price), 0);
    this.columns[5].show = (prop === 'proforma') ? true : false;
    this.columns[6].show = (prop === 'proforma') ? true : false;
    this.setState({ visibleTasks, totalPrice });
  }

  render (){
    if (this.state.visibleTasks) {
      return <>
        <div className="d-flex filter-level-1">
          <div className="dropdown">
            <button className="btn btn-success dropdown-toggle" type="button" id="brandFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              All brands
            </button>
            <div className="dropdown-menu">
              <button className="dropdown-item" type="button" onClick={e => this.brandFilter('All')}>All</button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" type="button" onClick={e => this.brandFilter('XMT')}>XMT</button>
              <button className="dropdown-item" type="button" onClick={e => this.brandFilter('XMS')}>XMS</button>
              <button className="dropdown-item" type="button" onClick={e => this.brandFilter('XMF')}>XMF</button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" type="button" onClick={e => this.brandFilter('No brand')}>No brand</button>
            </div>
          </div>
          {/* <Export type="xls" data={this.state.visibleTasks} /> */}
        </div>
        <Toolbar onClick={this.toolbarFilter}/>
        <ReactTable
          data={ this.state.visibleTasks } columns={ this.columns }
          defaultSorted={[
            {
              id: 'position',
              asc: true
            }
          ]}
          defaultPageSize={ 20 } className='-striped -highlight table'/>
        </>
    }
    return <div className='loader-place row align-items-center'>
      <div className='col row justify-content-center'>
        <Loader type='ThreeDots' height='80' width='200'/>
      </div>
    </div>
  }
}