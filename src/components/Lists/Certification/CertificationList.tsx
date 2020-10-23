import * as React from 'react';
import ReactTable from 'react-table';
import { Task } from '../../../Task/Task';
import { getColumns } from './columns';
import StageFilter from '../Filters/StageFilter';
import { ColumnFilter } from '../Filters/ColumnFilter';

import './List.css';
import { countTotalPrice } from '../../../helpers';

interface IListState {
  visibleData: any[];
  totalPrice: number;
  sortedData: Task[] | undefined;
  stage: string;
  startDate?: Date;
  endDate?: Date;
}

class CertificationList extends React.Component<{
  tasks: any;
}> {
  state: IListState = {
    visibleData: [],

    //used for Task PDF list (ejected out of react-table ref)
    sortedData: undefined,
    totalPrice: 0,
    stage: 'all',
  };
  ref: any;

  get columns() {
    return getColumns(this.state.totalPrice, this.state.stage);
  }

  async componentDidMount() {
    this.updateState();
  }

  resetFilters = () => {
    this.setState({
      startDate: undefined,
      endDate: undefined,
      stage: 'all',
    });
  };

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevProps.tasks !== this.props.tasks) {
      this.updateState();
      this.resetFilters();
    }
  }

  updateState = () => {
    const totalPrice = countTotalPrice(this.props.tasks);
    this.setState({
      totalPrice,
      visibleData: this.props.tasks,
    });
  };

  getTrProps(state: any, rowInfo: any, column: any) {
    if (rowInfo === undefined) {
      return {};
    }
    return rowInfo.original.overdue ? { className: 'missedDeadline' } : {};
  }

  render = (): JSX.Element => (
    <>
      <div className="d-flex mb-1">
        <div className="d-flex w-100">
          <div className="mr-2">
            <StageFilter
              tasks={this.props.tasks}
              update={this.setState.bind(this)}
            />
          </div>
          <ColumnFilter
            dataToFilter={this.props.tasks}
            filteringDataType="tasks"
            update={(visibleData: any) => {
              this.setState({
                visibleData,
              });
            }}
          />
        </div>
        <div className="d-flex">
          {/* <ListExport
                    tasks={this.state.visibleData}
                    columns={this.columns}
                    stage={this.state.stage}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    /> */}
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
        onSortedChange={() =>
          this.setState({
            visibleTasks: this.ref
              .getResolvedState()
              .sortedData.map(({ _original }: any) => _original),
          })
        }
        noDataText="First time update takes a little while, please do not close page until it is done. See for green button at top right corner"
        ref={(ref) => (this.ref = ref)}
        className="-highlight table"
        getTrProps={this.getTrProps}
        defaultPageSize={10}
      />
    </>
  );
}

export { CertificationList };
