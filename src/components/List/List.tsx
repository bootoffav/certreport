import './List.css';
import React from 'react';
import ReactTable from "react-table";
import Task, { Stage } from '../../Task/Task';
import '../../css/style.css';
import { Toolbar, filter } from '../Toolbar/Toolbar';
import { getColumns } from './columns';
import { ColumnSearch, BrandFilter, DateFilter } from '../Filters';
import CacheManager from '../../CacheManager';
import { Settings, generalSettingsFilter } from '../Settings/Settings';
import TaskNamesExport from '../Export/PDF/TaskNamesExport';

interface IListState {
  visibleTasks: Task[];
  allTasks: Task[];
  filteredTasksLevel1: Task[];
  tasks: Task[];
  totalPrice: number;
  sortedData: Task[] | undefined;
  requiredStage: Stage | undefined;
}

export default class List extends React.Component {
  state: IListState = {
    visibleTasks: [],
    allTasks: [],
    filteredTasksLevel1: [],
    tasks: [],
    sortedData: undefined, //used for Task PDF list (ejected out of react-table ref)
    totalPrice: 0,
    requiredStage: undefined,
  };
  ref: any;

  cache = new CacheManager();
  
  get columns() {
    return getColumns(this.state.totalPrice, this.cache.staleData, this.state.requiredStage);
  }

  static State: React.FunctionComponent<{
    notUpdated: boolean;
  }> = ({ notUpdated }) =>
    notUpdated ?
    <div className="d-flex align-items-center">
      <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
    </div>
    : <></>

  async componentDidMount() {
    if (this.cache.staleData) {
      this.updateState(this.cache.getFromCache(localStorage));
      this.cache.setCaches(await this.cache.getFromAPI());
    }
    this.updateState();
  }

  updateState = (providedTasks: Task[] | undefined = undefined) => {
    const tasks: Task[] = generalSettingsFilter(
      providedTasks || this.cache.getFromCache(sessionStorage)
    );
    
    const visibleTasks: Task[] = filter(tasks);
    const totalPrice: number = visibleTasks.reduce((sum: number, task: any) => sum + Number(task.state.price), 0);
    this.setState({
      filteredTasksLevel1: tasks,
      tasks, visibleTasks, totalPrice, requiredStage: undefined
    });
  }

  //level 1 filter
  brandFilter = (e: React.SyntheticEvent<HTMLButtonElement>): void => {
    const brand = e.currentTarget.innerText;
    let brandFilter: HTMLElement | null = document.getElementById('brandFilter');
    brandFilter ? brandFilter.innerText = `Brand: ${brand}` : '';
    let filtered;

    switch (brand) {
      case 'All':
        filtered = this.state.tasks;
        break;
      case 'No brand':
        filtered = this.state.tasks.filter((task: any) => !Boolean(task.state.brand));
        break;
      default:
        filtered = this.state.tasks.filter((task: any) => task.state.brand === brand);
    }

    this.setState({
      filteredTasksLevel1: filtered
    }, () => this.toolbarFilter(this.state.requiredStage));
  }

  columnFilter = (valueToSearch: string, columnToSearch: string) : void => {
    valueToSearch = valueToSearch.toLowerCase();
    this.setState({
      filteredTasksLevel1: this.state.tasks.filter((task: any) => columnToSearch === 'TITLE'
        ? task[columnToSearch].toLowerCase().includes(valueToSearch)
        : task.state[columnToSearch].toLowerCase().includes(valueToSearch)
      )
    }, () => this.toolbarFilter(this.state.requiredStage));
  }

  dateFilter = (startDate: Date | null, endDate: Date | null): void => {
    if (endDate === null) {
      this.setState({
        filteredTasksLevel1: this.state.tasks
      }, () => this.toolbarFilter(this.state.requiredStage));
      return;
    }
    if (startDate !== null && endDate !== null) {
      const tasksInRange = this.state.tasks.filter((task: any) => {
        const comparingDate = new Date(task.state.certReceivedOnRealDate);
        return startDate < comparingDate && endDate > comparingDate
      });

      this.setState({
        filteredTasksLevel1: tasksInRange
      }, () => this.toolbarFilter(this.state.requiredStage));
    }
  }

  //level 2 filter
  toolbarFilter = (requiredStage: Stage | undefined | string = undefined) => {
    let visibleTasks: Task[] = filter(this.state.filteredTasksLevel1, requiredStage);
    let totalPrice: number = visibleTasks.reduce((sum: number, task: any) => sum + Number(task.state.price), 0);
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
        <DateFilter filter={this.dateFilter} />
      </div>
      <div className="d-inline-flex justify-content-end">
        <List.State notUpdated={this.cache.staleData} />
        <TaskNamesExport
          tasks={this.state.sortedData || this.state.visibleTasks}
        />
        <div className="align-self-center">
          <Settings onClose={() => this.updateState()} />
        </div>
      </div>
    </div>
    <Toolbar onClick={this.toolbarFilter} />
    <ReactTable
      data={this.state.visibleTasks} columns={this.columns}
      defaultSorted={[
        {
          id: 'position',
          desc: false
        }
      ]}
      onSortedChange={() => this.setState({
        sortedData: this.ref.getResolvedState().sortedData.map(({ _original }: any) => _original)
      })}
      ref={(ref) => this.ref = ref}
      className='-striped -highlight table'
      getTrProps={this.getTrProps}
    />
  </>
}