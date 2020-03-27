import React from 'react';
import ReactTable from "react-table";
import './List.css';
import Task from '../../Task/Task';
import '../../css/style.css';
import { Toolbar, filter } from '../Toolbar/Toolbar';
import { getColumns } from './columns';
import { ColumnSearch, BrandFilter, DateFilter } from '../Filters';
import { Settings, generalSettingsFilter } from '../Settings/Settings';
import ListExport from '../Export/PDF/ListExport';

interface IListState {
  visibleTasks: Task[];
  allTasks: Task[];
  filteredTasksLevel1: Task[];
  tasks: any;
  totalPrice: number;
  sortedData: Task[] | undefined;
  requiredStage: string | undefined;
  startDate?: Date;
  endDate?: Date;
}

export default class List extends React.Component<{ data: any; staleData: boolean; }> {
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

  get columns() {
    return getColumns(this.state.totalPrice, this.state.requiredStage);
  }

  static State: React.FunctionComponent<{
    staleData: boolean;
  }> = ({ staleData }) => {
    return staleData ?
      <div className="d-flex align-items-center">
        <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
      </div>
      : <></>
  }

  async componentDidMount() {
    this.updateState();
  }

  UNSAFE_componentWillReceiveProps({ tasks }: any) {
    this.updateState(tasks);
  }

  updateState = (providedTasks?: any) => {
    const tasks: Task[] = generalSettingsFilter(
      providedTasks || this.props.data.allTasks
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
    const brandFilter = document.getElementById('brandFilter');
    if (brandFilter !== null) brandFilter.innerText = `Brand: ${brand}`;
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

  columnFilter = (searchVal: string, columnToSearch: string) : void => {
    let foundTasks;
    searchVal = searchVal.toLowerCase();
    foundTasks = this.state.tasks.filter((task: any) => columnToSearch === 'TITLE'
      ? task[columnToSearch].toLowerCase().includes(searchVal)
      : task.state[columnToSearch].toLowerCase().includes(searchVal)
    );
    
    this.setState({
      filteredTasksLevel1: foundTasks
    }, () => this.toolbarFilter(this.state.requiredStage));
  
  }

  dateFilter = (startDate?: Date, endDate?: Date): void => {
    let tasksForUpdate: any;
    if (!startDate || !endDate) {
      tasksForUpdate = this.state.tasks;
    } else {
      tasksForUpdate = this.state.tasks.filter((task: any) => {
        const comparingDate = new Date(task.state.certReceivedOnRealDate);
        return startDate < comparingDate && endDate > comparingDate
      });
    }
    this.setState({
      filteredTasksLevel1: tasksForUpdate, startDate, endDate
    }, () => this.toolbarFilter(this.state.requiredStage));
  }

  toolbarFilter = (requiredStage: undefined | string = undefined) => {
    if (requiredStage === 'products') {
      this.setState({ requiredStage });
      return;
    }
    let visibleTasks: Task[] = filter(this.state.filteredTasksLevel1, requiredStage);
    let totalPrice: number = visibleTasks.reduce((sum: number, task: any) => sum + Number(task.state.price), 0);
    this.setState({ visibleTasks, totalPrice, requiredStage });
  }

  getTrProps(state: any, rowInfo: any, column: any) {
    if (rowInfo === undefined) {
      return {};
    }
    return rowInfo.original.overdue ? { className: 'missedDeadline' } : {};
  }

  render = (): JSX.Element => <>
    <div className="d-flex justify-content-between mb-1">
      <div className="d-inline-flex justify-content-start flex-grow-1">
        <div className="mr-2"><BrandFilter filter={this.brandFilter} /></div>
        <div className="mr-2"><Toolbar onClick={this.toolbarFilter} /></div>
        <ColumnSearch filter={this.columnFilter} />
        <div className="ml-3"><DateFilter filter={this.dateFilter} /></div>
      </div>
      <div className="d-inline-flex justify-content-end">
        <List.State staleData={this.props.staleData} />
        <ListExport
          tasks={this.state.visibleTasks}
          // @ts-ignore
          columns={this.columns.filter(column => column.show)}
          stage={this.state.requiredStage}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
        />
        <div className="align-self-center">
          <Settings onClose={() => this.updateState()} />
        </div>
      </div>
    </div>
      <ReactTable
        data={
          this.state.requiredStage === 'products'
            ? this.props.data.allProducts
            : this.state.visibleTasks
        }
        columns={this.columns}
        resolveData={(data: any, i = 1) =>
          data.map((row: any) => {
            row.position = i++;
            return row;
          })
        }
      // onSortedChange={() => this.setState({
      //   visibleTasks: this.ref.getResolvedState().sortedData.map(({ _original }: any) => _original)
      // })}
      ref={(ref) => this.ref = ref}
      className='-striped -highlight table'
      // getTrProps={this.getTrProps}
      />
    </>
}