import './List.css';
import React from 'react';
import m from 'moment';
import Loader from 'react-loader-spinner';
import ReactTable, { Column } from "react-table";
import Task, { Stage } from '../../Task/Task';
import '../../css/style.css';
import { Toolbar, filter } from '../Toolbar/Toolbar';
import { getColumns, visibleColumns } from './columns';
// import { Export } from '../Export/Export';
import { ColumnSearch, BrandFilter } from '../Filters';
import CacheManager from '../../CacheManager';
import { Settings } from '../Settings/Settings';



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
  columns = getColumns(this.state.totalPrice, this.cache.staleData);

  static State: React.FunctionComponent<{
    notUpdated: boolean;
  }> = ({ notUpdated }) =>
    notUpdated ?
    <div className="d-flex align-items-center">
      <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
    </div>
    : <></>

  async componentDidMount() {
    let allTasks = await this.cache.load();
    this.updateState(allTasks);

    if (this.cache.staleData) {
      allTasks = await this.cache.getFromAPI();
      this.cache.setCaches(allTasks);
      this.columns = getColumns(this.state.totalPrice, this.cache.staleData);
      this.updateState(allTasks);
    }
  }

  updateState = (allTasks : Task[]) : void => {
    //определить задачи по которым будет создан список
    const uncompletedTasks : Task[] = allTasks.filter((task: Task) => task.state.stage !== Stage[8]); //только те у которых статус не готов
    
    const tasks: Task [] = this.state.showCompletedTasks
      ? allTasks
      : uncompletedTasks;
    
    const visibleTasks: Task[] = filter(tasks);
    const totalPrice: number = visibleTasks.reduce((sum: number, task: any) => sum + Number(task.state.price), 0);
    visibleColumns.call(this);
    this.setState({
      allTasks: allTasks,
      filteredTasksLevel1: tasks,
      uncompletedTasks, visibleTasks, totalPrice, requiredStage: undefined
    });
  }

  //level 1 filter
  brandFilter = (e: React.SyntheticEvent<HTMLButtonElement>): void => {
    const brand = e.currentTarget.innerText;
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
  toolbarFilter = (requiredStage: Stage | undefined | string = undefined) => {
    let visibleTasks: Task[] = filter(this.state.filteredTasksLevel1, requiredStage);
    let totalPrice: number = visibleTasks.reduce((sum: number, task: any) => sum + Number(task.state.price), 0);
    visibleColumns.call(this, requiredStage);
    this.setState({ visibleTasks, totalPrice, requiredStage });
  }

  getTrProps(state: any, rowInfo: any, column: any) {
    if (rowInfo == undefined) {
      return {};
    }
    return rowInfo.original.overdue ? { className: 'missedDeadline' } : {};
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
            onClose={() => {
              this.updateState(this.state.allTasks);
            }}
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
      getTrProps={this.getTrProps}
    />
  </>
}