import React from 'react';
import ReactTable from 'react-table';
import { Button } from 'tabler-react';
import './List.css';
import Task from '../../Task/Task';
import '../../css/style.css';
import { Toolbar, filter } from '../Toolbar/Toolbar';
import { getColumns } from './columns';
import { ColumnSearch, BrandFilter, DateFilter } from '../Filters';
import { Settings, generalSettingsFilter } from '../Settings/Settings';
import ListExport from '../Export/PDF/ListExport';

interface IListState {
  visibleData: any[];
  tasks: [];
  totalPrice: number;
  sortedData: Task[] | undefined;
  requiredStage?: string;
  startDate?: Date;
  endDate?: Date;
}

export default class List extends React.Component<{ data: any; staleData: boolean; }> {
  state: IListState = {
    visibleData: [],
    tasks: [],
    sortedData: undefined, //used for Task PDF list (ejected out of react-table ref)
    totalPrice: 0,
  };
  ref: any;

  get columns() {
    return getColumns(this.state.totalPrice, this.state.requiredStage);
  }

  static State: React.FunctionComponent<{
    staleData: boolean;
  }> = ({ staleData }) =>
    staleData ?
      <Button loading color="success" icon="check" size="sm" className="mr-1" />
      : <></>

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
    
    const visibleData: Task[] = filter(tasks);
    const totalPrice: number = visibleData.reduce((sum: number, task: any) => sum + Number(task.state.price), 0);
    this.setState({
      tasks,
      visibleData,
      totalPrice,
    });
  }

  brandFilter = (e: React.SyntheticEvent<HTMLButtonElement>): void => {
    const brand = e.currentTarget.innerText;
    const brandFilter = document.getElementById('brandFilter');
    if (brandFilter !== null) brandFilter.innerText = `Brand: ${brand}`;
    let visibleData;

      switch (brand) {
        case 'All':
          visibleData = this.state.tasks;
          break;
        case 'No brand':
          visibleData = this.state.tasks.filter((task: any) => !Boolean(task.state.brand));
          break;
        default:
          visibleData = this.state.tasks.filter((task: any) => task.state.brand === brand);
      }

    this.setState({
      requiredStage: undefined,
      visibleData
    });
  }

  columnFilter = (searchVal: string, columnToSearch: string) : void => {
    let visibleData;
    searchVal = searchVal.toLowerCase();
    if (this.state.requiredStage === 'products') {
      visibleData = this.props.data.allProducts.filter((product: any) => {
        if (columnToSearch === 'article') {
          return product[columnToSearch].toLowerCase().includes(searchVal)
        } else {

          return product[columnToSearch].join(', ').toLowerCase().includes(searchVal);
        }
      })
    } else {
      visibleData = this.state.tasks.filter((task: any) => columnToSearch === 'TITLE'
        ? task[columnToSearch].toLowerCase().includes(searchVal)
        : task.state[columnToSearch].toLowerCase().includes(searchVal)
      );
    }

    this.setState({ visibleData });
  }

  dateFilter = (startDate?: Date, endDate?: Date): void => {
    let visibleData: any;
    if (!startDate || !endDate) {
      visibleData = this.state.tasks;
    } else {
      visibleData = this.state.tasks.filter((task: any) => {
        const comparingDate = new Date(task.state.certReceivedOnRealDate);
        return startDate < comparingDate && endDate > comparingDate
      });
    }

    this.setState({
      requiredStage: undefined,
      startDate,
      endDate,
      visibleData
    });
  }

  toolbarFilter = (requiredStage?: string) => {
    if (requiredStage === 'products') {
      return this.setState({
         requiredStage,
        visibleData: this.props.data.allProducts
      });
    }

    let visibleData: Task[] = filter(this.state.tasks, requiredStage);

    this.setState({
      visibleData,
      requiredStage,
      totalPrice: visibleData.reduce((sum: number, task: any) => sum + Number(task.state.price), 0)
    });
  }

  getTrProps(state: any, rowInfo: any, column: any) {
    if (rowInfo === undefined) {
      return {};
    }
    return rowInfo.original.overdue ? { className: 'missedDeadline' } : {};
  }

  render = (): JSX.Element => <>
    <div className="d-flex mb-1">
      <div className="d-flex w-100">
        <div className="mr-2"><BrandFilter filter={this.brandFilter} /></div>
        <div className="mr-2"><Toolbar onClick={this.toolbarFilter} /></div>
        <ColumnSearch
          requiredStage={this.state.requiredStage}
          filter={this.columnFilter}
        />
        <div className="ml-3"><DateFilter filter={this.dateFilter} /></div>
      </div>
      <div className="d-flex">
        <List.State staleData={this.props.staleData} />
        <ListExport
          tasks={this.state.visibleData}
          columns={this.columns}
          stage={this.state.requiredStage}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
        />
        <Settings onClose={() => this.updateState()} />
      </div>
    </div>
    <ReactTable
      data={this.state.visibleData}
      columns={this.columns}
      resolveData={(data: any, i = 1) =>
        data.map((row: any) => {
          row.position = i++;
          return row;
        })
      }
      onSortedChange={() => this.setState({
        visibleTasks: this.ref.getResolvedState().sortedData.map(({ _original }: any) => _original)
      })}
      ref={(ref) => this.ref = ref}
      className='-striped -highlight table'
      getTrProps={this.getTrProps}
    />
  </>
}