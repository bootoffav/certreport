import * as React from 'react';
import ReactTable from 'react-table';
import { getColumns } from './columns';
import StageFilter from '../Filters/StageFilter';
import { ColumnFilter } from '../Filters/ColumnFilter';
import { ListExport } from '../../Export/PDF/ListExport';

import './List.css';
import { countTotalPrice } from '../../../helpers';

interface ICertificationListState {
  visibleData: any[];
  totalPrice: number;
  startDate?: Date;
  endDate?: Date;
}

interface ICertificationListProps {
  tasks: any;
  update: any;
  stage: string;
}

class CertificationList extends React.Component<
  ICertificationListProps,
  ICertificationListState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      visibleData: this.props.tasks,
      totalPrice: countTotalPrice(this.props.tasks),
    };
  }

  get columns() {
    return getColumns(this.state.totalPrice, this.props.stage);
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevProps.tasks !== this.props.tasks) {
      this.setState({
        visibleData: this.props.tasks,
        totalPrice: countTotalPrice(this.props.tasks),
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
          <ListExport
            tasks={this.state.visibleData}
            columns={this.columns}
            stage={this.props.stage}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
          />
        </div>
      </div>
      <ReactTable
        data={this.state.visibleData}
        columns={this.columns}
        defaultSorted={[
          {
            id: 'createdDate',
            desc: true,
          },
        ]}
        noDataText="update takes a little while, please do not close page until it is done. See for green button at top right corner"
        className="-highlight table"
        getTrProps={this.getTrProps}
        defaultPageSize={20}
      />
    </>
  );
}

export { CertificationList };
