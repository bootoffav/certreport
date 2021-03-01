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
  startDate?: Date;
  endDate?: Date;
}

class CertificationList extends React.Component<{
  tasks: any;
  update: any;
  stage: string;
}> {
  state: IListState = {
    visibleData: this.props.tasks,
    sortedData: undefined,
    totalPrice: countTotalPrice(this.props.tasks),
  };
  ref: any;

  get columns() {
    return getColumns(this.state.totalPrice, this.props.stage);
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevProps.tasks !== this.props.tasks) {
      this.setState({
        totalPrice: countTotalPrice(this.props.tasks),
        visibleData: this.props.tasks,
      });
    }
  }

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
            <StageFilter {...this.props} />
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
