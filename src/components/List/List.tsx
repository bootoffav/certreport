import './List.css';
import React from 'react';
import Loader from 'react-loader-spinner';
import ReactTable, { Column } from "react-table";
import { Link } from 'react-router-dom';
import Task, { Stage } from '../../Task';
import '../../css/style.css';
import { Toolbar } from '../Toolbar/Toolbar';
// import { Export } from '../Export/Export';
import { ColumnSearch, BrandFilter } from '../Filters';
import CacheManager from '../../CacheManager';
import m from 'moment';

interface IListState {
    visibleTasks: Task[];
    allTasks: Task[];
    filteredTasksLevel1: Task[];
    totalPrice: string;
    toolbarProp: string;
}

export default class List extends React.Component {
  state : IListState = {
    visibleTasks: [],
    allTasks: [],
    filteredTasksLevel1: [],
    totalPrice: '',
    toolbarProp: 'all'
  };
  cache = new CacheManager();
  static State = (props : any) => (
    <>
      <div id="cacheStateLabel" className="p-1"
      >{props.notUpdated
        ? 'contacting Bitrix24, receiving updates'
        : 'state is actual'}
      </div>
      <div id="cacheStateLoader" className="p-1"
      >{props.notUpdated
        ? <Loader type='Circles' color='blueviolet' height='30' width='30'/>
        : ''}
      </div>
    </>
  );

  columns : any[] = [{
      Header: '#',
      id: 'position',
      accessor: 'position',
      width: 40
    },{
      Header: '##',
      id: 'serialNumber',
      accessor: (row : any) => row.state.serialNumber ? String(row.state.serialNumber) : '',
      width: 55,
      Cell: (props : any) => <a 
        href={`https://xmtextiles.bitrix24.ru/company/personal/user/460/tasks/task/view/${props.original.ID}/`}
        target="_blank" rel="noopener noreferrer"
        >
          { props.value }
        </a>
    }, {
      Header: 'Brand',
      id: 'brand',
      minWidth: 50,
      accessor: 'state.brand'
    },{
      Header: 'Status',
      id: 'stage',
      minWidth: 100,
      accessor: (row : any) => Stage[row.stage]
    },{
      Header: 'Task name',
      accessor: 'TITLE',
      id: 'taskName',
      minWidth: 550,
      Cell: (props : any) => {
        return (props.original.state.serialNumber) ?
          <Link className={this.cache.staleData ? 'EditLinkIsDisabled' : ''}
            to={
              this.cache.staleData
              ? '' : {
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
      Header: 'Sample prepared on',
      accessor: 'state.readyOn',
      id: 'readyOn',
      width: 130,
    }, {
      Header: 'Sent On',
      accessor: 'state.sentOn',
      id: 'sentOn',
      width: 130,
    }, {
      Header: 'Sample received On',
      accessor: 'state.receivedOn',
      id: 'receivedOn',
      width: 130,
    }, {
      Header: 'Tests finished On',
      accessor: 'state.finishedOn',
      id: 'receivedOn',
      width: 130,
    }, {
      Header: 'Results received',
      accessor: 'state.resultsReceived',
      id: 'receivedOn',
      width: 130,
    }, {
      Header: 'Proforma date',
      accessor: 'state.proformaReceivedDate',
      id: 'proformaReceivedDate',
      width: 130,
    }, {
      Header: 'Proforma #',
      accessor: 'state.proformaNumber',
      id: 'proformaNumber',
      width: 100,
    }, {
      Header: 'Paid',
      id: 'paid',
      accessor: (row : any) => row.state.paymentDate,
      minWidth: 40,
      Cell: (props : any) => props.value 
              ? <span className="oi oi-check"></span>
              : ''
    }, {
      Header: 'Payment date',
      id: 'paymentDate',
      accessor: (row : any) => row.state.paymentDate,
      width: 130,
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
    }, {
      Header: 'Price, €',
      Footer: () => <>Total € <span style={{ float: 'right' }}>{this.formatPrice(this.state.totalPrice)}</span></>,
      id: 'price',
      accessor: (row : any) => Number(row.state.price),
      minWidth: 90,
    Cell: (props : any) => <>€<span style={{ float: 'right' }}>{this.formatPrice(props.value)}</span></>
    }];

  formatPrice = (price : string) => Number(price)
    .toLocaleString('en-US', {
      style: 'currency',
      currency: 'EUR'
    })
    .replace(/,/g, ' ')
    .replace(/\./g, ',')
    .substr(1);

  async componentDidMount() {
    let tasks = await this.cache.load();
    this.updateState(tasks);

    if (this.cache.staleData) {
      tasks = await this.cache.getFromAPI();
      this.cache.setCaches(tasks);
      this.updateState(tasks);
    }
  }

  updateState = (tasks : any) => {
    const toolbarProp : string = 'all';
    let visibleTasks = Toolbar.filter(tasks, toolbarProp);
    this.visibleColumns(toolbarProp);
    let totalPrice = visibleTasks.reduce((sum : number, task : any) => sum + Number(task.state.price), 0);
    this.setState({ 
      allTasks: tasks,
      filteredTasksLevel1: tasks,
      visibleTasks,
      totalPrice,
      toolbarProp
    });
  }
  
  //level 1 filter
  brandFilter(brand : string) {
    let brandFilter : HTMLElement | null = document.getElementById('brandFilter');
    brandFilter ? brandFilter.innerText = `Brand: ${brand}` : '';
    let filtered;
    switch (brand) {
      case 'All':
        filtered = this.state.allTasks;
        break;
      case 'No brand':
        filtered = this.state.allTasks.filter((task : any) => !Boolean(task.state.brand));
        break;
      default:
        filtered = this.state.allTasks.filter((task : any) => task.state.brand === brand);
    }

    this.setState({
      filteredTasksLevel1: filtered
    }, this.filterLevel1Callback);
  }

  columnFilter = (valueToSearch : any, columnToSearch : any) => {
    valueToSearch = valueToSearch.toLowerCase();
    this.setState({
      filteredTasksLevel1: this.state.allTasks.filter((task : any) => columnToSearch === 'TITLE'
        ? task[columnToSearch].toLowerCase().includes(valueToSearch)
        : task.state[columnToSearch].toLowerCase().includes(valueToSearch)
      )
    }, this.filterLevel1Callback);
  }

  filterLevel1Callback = () => {
    this.toolbarFilter();
    Array.from(document.getElementsByClassName('btn btn-warning btn-sm'))
      .forEach(el => el.className = 'btn btn-warning btn-sm');
    document.getElementsByClassName('btn btn-warning btn-sm')[0].className += ' active';
  }

  //level 2 filter
  toolbarFilter = (toolbarProp : string = 'all') => {
    let visibleTasks = Toolbar.filter(this.state.filteredTasksLevel1, toolbarProp);
    let totalPrice = visibleTasks.reduce((sum : number, task : any) => sum + Number(task.state.price), 0);
    this.setState({ visibleTasks, totalPrice, toolbarProp });
    this.visibleColumns(toolbarProp);
  }

  visibleColumns(prop : string) : void {
    this.columns.forEach(col => col.show = true);
    let hidden: number[];

    switch (prop) {
      case 'Preparing Sample':
        hidden = [3, 6, 7, 8, 9, 10, 11, 12, 13];
        break;
      case 'Sample Sent':
        hidden = [3, 5, 7, 8, 9, 10, 11, 12, 13];
        break;
      case 'Sample Arrived':
        hidden = [3, 5, 6, 8, 9, 10, 11, 12, 13];
        break;
      case 'PI Issued':
        hidden = [3, 5, 6, 7, 8, 9, 12, 13];
        break;
      case 'Payment Done':
        hidden = [3, 5, 6, 7, 8, 9];
        break;
      case 'Tests are in progress':
        hidden = [3, 5, 6, 7, 9, 10, 11, 12, 13];
        break;
      case 'Results Ready':
        hidden = [3, 5, 6, 7, 8, 10, 11, 12, 13];
        break;
      case 'all':
        hidden = [5, 6, 7, 8, 9, 10, 11, 12, 13];
        break;
      default:
        hidden = [5, 6, 7, 10, 11, 12, 13];
    }

    this.columns.forEach((col, ind) => {
      if (hidden.includes(ind)) col.show = false;
    });
  }

  getTrProps = (state : any, rowInfo : any, column : any) : {} => {
    if (rowInfo !== undefined) {
      switch (this.state.toolbarProp) {
        case 'Preparing Sample':
          return m(rowInfo.row._original.state.readyOn).add(2, 'days') < m()
          ? { className: "missedDeadline" }
          : {};
        case 'Sample Sent':
          return m(rowInfo.row._original.state.sentOn).add(7, 'days') < m()
          ? { className: "missedDeadline" }
          : {};
        case 'Sample Arrived':
          return m(rowInfo.row._original.state.receivedOn).add(2, 'days') < m()
          ? { className: "missedDeadline" }
          : {};
        case 'PI Issued':
          return m(rowInfo.row._original.state.proformaReceivedDate).add(2, 'days') < m()
          ? { className: "missedDeadline" }
          : {};
        case 'Payment Done':
          return m(rowInfo.row._original.state.paymentDate).add(2, 'days') < m()
          ? { className: "missedDeadline" }
          : {};
        case 'Tests are in progress':
          return m(rowInfo.row._original.state.finishedOn).add(1, 'days') < m()
          ? { className: "missedDeadline" }
          : {};
      }
    }
    return {};
  }

  render = () => <>
    <div className="d-flex justify-content-between">
      <div className="d-inline-flex justify-content-start">
        <div className="p-1">
          <BrandFilter filter={this.brandFilter.bind(this)}/>
        </div>
        <div className="p-1">
          <ColumnSearch filter={this.columnFilter}/>
        </div>
      </div>
      <div className="d-inline-flex justify-content-end">
        <List.State notUpdated={this.cache.staleData} />
      </div>
    </div>
      {/* <Export type="xls" data={this.state.visibleTasks} /> */}
    <Toolbar onClick={this.toolbarFilter}/>
    <ReactTable
      data={ this.state.visibleTasks } columns={ this.columns }
      defaultSorted={[
        {
          id: 'position',
          desc: false
        }
      ]}
      defaultPageSize={ 20 } className='-striped -highlight table'
      getTrProps={this.getTrProps.bind(this)}
      />
    </>
}