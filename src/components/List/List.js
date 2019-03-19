import './List.css';
import React from 'react';
import Loader from 'react-loader-spinner';
import ReactTable from "react-table";
import { Link } from 'react-router-dom';
import '../../css/style.css';
import { Toolbar, filter } from '../Toolbar/Toolbar';
// import { Export } from '../Export/Export';
import { ColumnSearch, BrandFilter } from '../Filters';
import CacheManager from '../../CacheManager';

export default class List extends React.Component {
  state = {};
  cache = new CacheManager();
  static State = ({notUpdated}) => (
    <>
      <div id="cacheStateLabel" className="p-1"
      >{notUpdated
        ? 'contacting Bitrix24, receiving updates'
        : 'state is actual'}
      </div>
      <div id="cacheStateLoader" className="p-1"
      >{notUpdated
        ? <Loader type='Circles' color='blueviolet' height='30' width='30'/>
        : ''}
      </div>
    </>
  );

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
      accessor: 'state.brand'
    },{
      Header: 'Task name',
      accessor: 'TITLE',
      id: 'taskName',
      minWidth: 550,
      Cell: props => {
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
      Header: 'Payment date',
      id: 'paymentDate',
      accessor: row => row.state.paymentDate,
      width: 130,
      show: false,
      Cell: props => props.value ? props.value.format("DD MMM YYYY") : ''
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

  async componentDidMount() {
    let tasks = await this.cache.load();
    this.updateState(tasks);

    if (this.cache.staleData) {
      tasks = await this.cache.getFromAPI();
      this.cache.setCaches(tasks);
      this.updateState(tasks);
    }
  }

  updateState = tasks => {
    let visibleTasks = filter(tasks);
    let totalPrice = visibleTasks.reduce((sum, task) => sum + Number(task.state.price), 0);
    this.setState({ allTasks: tasks, filteredTasksLevel1: tasks, visibleTasks, totalPrice });
  }
  
  //level 1 filter
  brandFilter(brand) {
    document.getElementById('brandFilter').innerText = `Brand: ${brand}`;
    let filtered;
    switch (brand) {
      case 'All':
        filtered = this.state.allTasks;
        break;
      case 'No brand':
        filtered = this.state.allTasks.filter(task => !Boolean(task.state.brand));
        break;
      default:
        filtered = this.state.allTasks.filter(task => task.state.brand === brand);
    }

    this.setState({
      filteredTasksLevel1: filtered
    }, this.filterLevel1Callback);
  }

  columnFilter = (valueToSearch, columnToSearch) => {
    valueToSearch = valueToSearch.toLowerCase();
    this.setState({
      filteredTasksLevel1: this.state.allTasks.filter(task => columnToSearch === 'TITLE'
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
  toolbarFilter = (prop = 'all') => {
    let visibleTasks = filter(this.state.filteredTasksLevel1, prop);
    let totalPrice = visibleTasks.reduce((sum, task) => sum + Number(task.state.price), 0);
    this.setState({ visibleTasks, totalPrice });
    prop === 'proforma'
    ? this.columns[5].show = this.columns[6].show = this.columns[8].show = true
    : this.columns[5].show = this.columns[6].show = this.columns[8].show = false;
    }

  render (){
    if (this.state.visibleTasks) {
      return <>
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
              asc: true
            }
          ]}
          defaultPageSize={ 20 } className='-striped -highlight table'/>
        </>
    }
    return (
      <div className='loader-place row align-items-center'>
        <div className='col row justify-content-center'>
          <Loader type='ThreeDots' height='80' width='200'/>
        </div>
      </div>);
  }
}