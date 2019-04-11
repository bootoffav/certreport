import './List.css';
import React from 'react';
import m from 'moment';
import Loader from 'react-loader-spinner';
import ReactTable, { Column } from "react-table";
import { Link } from 'react-router-dom';
import Task, { Stage } from '../../Task/Task';
import '../../css/style.css';
import { Toolbar } from '../Toolbar/Toolbar';
// import { Export } from '../Export/Export';
import { ColumnSearch, BrandFilter } from '../Filters';
import CacheManager from '../../CacheManager';
import Settings from '../Settings/Settings';



interface IListState {
  visibleTasks: Task[];
  allTasks: Task[];
  filteredTasksLevel1: Task[];
  uncompletedTasks: Task[];
  totalPrice: number;
  requiredStage: Stage | undefined;
  showCompletedTasks: boolean;
}

export default class List extends React.Component {
  state: IListState = {
    visibleTasks: [],
    allTasks: [],
    filteredTasksLevel1: [],
    uncompletedTasks: [],
    totalPrice: 0,
    requiredStage: undefined,
    showCompletedTasks: Boolean(
      Number(localStorage.getItem('showCompletedTasks'))
    )
  };

  cache = new CacheManager();

  static State: React.FunctionComponent<{
    notUpdated: boolean;
  }> = ({ notUpdated }) => (
    <>
      <div id="cacheStateLabel" className="p-1 align-self-center"
      >{notUpdated
        ? 'contacting Bitrix24, receiving updates'
        : 'state is actual'}
      </div>
      <div id="cacheStateLoader" className="p-1 align-self-center"
      >{notUpdated
        ? <Loader type='Circles' color='blueviolet' height='30' width='30' />
        : ''}
      </div>
    </>
  );

  columns: any[] = [{
    Header: '#',
    id: 'position',
    accessor: 'position',
    width: 40
  }, {
    Header: '##',
    id: 'serialNumber',
    accessor: (row: any) => row.state.serialNumber ? String(row.state.serialNumber) : '',
    width: 55,
    Cell: (props: any) => <a
      href={`https://xmtextiles.bitrix24.ru/company/personal/user/460/tasks/task/view/${props.original.ID}/`}
      target="_blank" rel="noopener noreferrer"
    >
      {props.value}
    </a>
  }, {
    Header: 'Brand',
    id: 'brand',
    minWidth: 50,
    accessor: 'state.brand'
  }, {
    Header: 'Status',
    id: 'stage',
    minWidth: 100,
    accessor: 'state.stage'
  }, {
    Header: 'Task title',
    accessor: 'TITLE',
    id: 'taskName',
    minWidth: 550,
    Cell: (props: any) => props.original.state.serialNumber ?
      <Link className={this.cache.staleData ? 'EditLinkIsDisabled' : ''}
        to={
          this.cache.staleData
            ? '' : {
              pathname: `/edit/${props.original.ID}`,
              state: { ...props.original.state }
            }
        }
      >{props.value}</Link>
      : <Link to={{
        pathname: `/edit/${props.original.ID}`,
        state: { ...props.original.state }
      }}>{props.value}</Link>
  }, {
    Header: 'Sample to be prepared on',
    accessor: 'state.readyOn',
    id: 'readyOn',
    width: 130,
  }, {
    Header: 'Sent On',
    accessor: 'state.sentOn',
    id: 'sentOn',
    width: 130,
  }, {
    Header: 'Sample has received On',
    accessor: 'state.receivedOn',
    id: 'receivedOn',
    width: 130,
  }, {
    Header: 'Tests to be finished On',
    accessor: 'state.finishedOn',
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
    accessor: 'state.paymentDate',
    minWidth: 40,
    Cell: (props: any) => props.value
      ? <span className="oi oi-check"></span>
      : ''
  }, {
    Header: 'Payment date',
    id: 'paymentDate',
    accessor: 'state.paymentDate',
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
    Header: 'Result',
    id: 'result',
    accessor: 'state.resume',
    minWidth: 40,
    Cell: (props: any) => {
      switch (props.value) {
        case 'fail':
          return <span className="oi oi-circle-x"></span>;
        case 'pass':
          return <span className="oi oi-thumb-up"></span>;
        default:
          return '';
      }
    }
    }, {
      Header: 'Price, €',
      Footer: () => <>Total € <span style={{ float: 'right' }}>{this.formatPrice(this.state.totalPrice)}</span></>,
      id: 'price',
      accessor: 'state.price',
      minWidth: 90,
      Cell: (props: any) => <>€<span style={{ float: 'right' }}>{this.formatPrice(props.value)}</span></>
    }];

  formatPrice = (price: number): string => price
      .toLocaleString('en-US', {
        style: 'currency',
        currency: 'EUR'
      })
    .replace(/,/g, ' ')
    .replace(/\./g, ',')

  async componentDidMount() {
    let allTasks = await this.cache.load();
    this.updateState(allTasks);

    if (this.cache.staleData) {
      allTasks = await this.cache.getFromAPI();
      this.cache.setCaches(allTasks);
      this.updateState(allTasks);
    }
  }

  updateState = (allTasks : Task[]) : void => {
    //определить задачи по которым будет создан список
    const uncompletedTasks : Task[] = allTasks.filter((task: Task) => task.state.stage !== Stage[8]); //только те у которых статус не готов
    
    const tasks: Task [] = this.state.showCompletedTasks
      ? allTasks
      : uncompletedTasks;
    
    const visibleTasks: Task[] = Toolbar.filter(tasks);
    const totalPrice: number = visibleTasks.reduce((sum: number, task: any) => sum + Number(task.state.price), 0);
    this.visibleColumns();
    this.setState({
      allTasks: allTasks,
      filteredTasksLevel1: tasks,
      uncompletedTasks, visibleTasks, totalPrice, requiredStage: undefined
    });
  }

  //level 1 filter
  brandFilter = (brand: string) : void => {
    let brandFilter: HTMLElement | null = document.getElementById('brandFilter');
    brandFilter ? brandFilter.innerText = `Brand: ${brand}` : '';
    let filtered;

    let tasks = this.state.showCompletedTasks
      ? this.state.allTasks
      : this.state.uncompletedTasks; //determine general settings set up

    switch (brand) {
      case 'All':
        filtered = tasks;
        break;
      case 'No brand':
        filtered = tasks.filter((task: any) => !Boolean(task.state.brand));
        break;
      default:
        filtered = tasks.filter((task: any) => task.state.brand === brand);
    }

    this.setState({
      filteredTasksLevel1: filtered
    }, () => this.toolbarFilter(this.state.requiredStage));
  }

  columnFilter = (valueToSearch: string, columnToSearch: string) : void => {
    let tasks : Task[] = this.state.showCompletedTasks
      ? this.state.allTasks
      : this.state.uncompletedTasks; //determine general settings set up

    valueToSearch = valueToSearch.toLowerCase();
    this.setState({
      filteredTasksLevel1: tasks.filter((task: any) => columnToSearch === 'TITLE'
        ? task[columnToSearch].toLowerCase().includes(valueToSearch)
        : task.state[columnToSearch].toLowerCase().includes(valueToSearch)
      )
    }, () => this.toolbarFilter(this.state.requiredStage));
  }

  //level 2 filter
  toolbarFilter = (requiredStage: Stage | undefined = undefined) => {
    let visibleTasks: Task[] = Toolbar.filter(this.state.filteredTasksLevel1, requiredStage);
    let totalPrice: number = visibleTasks.reduce((sum: number, task: any) => sum + Number(task.state.price), 0);
    this.visibleColumns(requiredStage);
    this.setState({ visibleTasks, totalPrice, requiredStage });
  }

  visibleColumns(requiredStage : Stage | undefined = undefined): void {
    this.columns.forEach(col => col.show = true);
    let hidden: number[];

    switch (requiredStage) {
      case Stage['0. Sample to be prepared']:
        hidden = [3, 6, 7, 8, 9, 10, 11, 12, 17, 18];
        break;
      case Stage['1. Sample Sent']:
        hidden = [3, 5, 7, 8, 9, 10, 11, 12, 17, 19];
        break;
      case Stage['2. Sample Arrived']:
        hidden = [3, 5, 6, 8, 9, 10, 11, 12, 17, 19];
        break;
      case Stage['3. PI Issued']:
        hidden = [3, 5, 6, 7, 8, 9, 12, 13, 17, 19];
        break;
      case Stage['4. Payment Done']:
        hidden = [3, 5, 6, 7, 8, 9, 17];
        break;
      case Stage['5. Testing is started']:
        hidden = [3, 5, 6, 7, 9, 10, 11, 12, 17, 18];
        break;
      // case Stage['6. Pre-treatment done - PASS/FAIL']:
      //   break;
      case Stage['7. Test-report ready']:
      case Stage['8. Certificate ready']:
        hidden = [3, 5, 6, 7, 8, 10, 11, 12];
        break;
      default:
        hidden = [5, 6, 7, 8, 9, 10, 11, 12];
    }

    this.columns.forEach((col, ind) => {
      if (hidden.includes(ind)) col.show = false;
    });
  }

  getTrProps = (state: any, rowInfo: any, column: any): {} => {
    if (rowInfo !== undefined) {
      const getResult = (prop: string, days: number): {} =>
        m(rowInfo.row._original.state[prop]).add(days, 'days') < m()
        ? { className: "missedDeadline" }
        : {};
      
      switch (this.state.requiredStage) {
        case Stage['0. Sample to be prepared']:
          return getResult('readyOn', 2);
        case Stage['1. Sample Sent']:
          return getResult('sentOn', 7);
        case Stage['2. Sample Arrived']:
          return getResult('receivedOn', 2);
        case Stage['3. PI Issued']:
          return getResult('proformaReceivedDate', 2);
        case Stage['4. Payment Done']:
          return getResult('paymentDate', 2);
        case Stage['5. Testing is started']:
          return getResult('testFinishedOnPlanDate', 1);
      }
    }
    return {};
  }

  render = () : JSX.Element => <>
    <div className="mb-1 mt-2 d-flex justify-content-between">
      <div className="d-inline-flex justify-content-start">
        <BrandFilter filter={this.brandFilter} />
        <ColumnSearch filter={this.columnFilter} />
      </div>
      <div className="d-inline-flex justify-content-end">
        <List.State notUpdated={this.cache.staleData} />
        <div className="align-self-center">
          <Settings checked={this.state.showCompletedTasks}
            toggle={() => {
              localStorage.setItem('showCompletedTasks', Number(!this.state.showCompletedTasks).toString());
              this.setState({ showCompletedTasks: !this.state.showCompletedTasks });
            }}
            onClose={() => this.updateState(this.state.allTasks)}
          />
        </div>
      </div>
    </div>
    {/* <Export type="xls" data={this.state.visibleTasks} /> */}
    <Toolbar onClick={this.toolbarFilter} />
    <ReactTable
      data={this.state.visibleTasks} columns={this.columns}
      defaultSorted={[
        {
          id: 'position',
          desc: false
        }
      ]}
      defaultPageSize={20} className='-striped -highlight table'
      getTrProps={this.getTrProps.bind(this)}
    />
  </>
}