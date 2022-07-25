import * as React from 'react';
import ReactTable from 'react-table';
import { getColumns } from './columns';
import StageFilter from '../Filters/StageFilter';
import ColumnFilter from '../Filters/ColumnFilter';
import { connect } from 'react-redux';

import './List.css';
import { countTotalPrice } from 'helpers';
import { RootState } from 'store/store';
import { Payments } from 'Task/Task.interface';

interface ICertificationListState {
  visibleTasks: any[];
  totalPrice: number;
  startDate?: Date;
  endDate?: Date;
}

interface ICertificationListProps {
  tasks: any;
  visibleTasks: any[];
  update: any;
  stages: any;
  payments: Payments;
}

class CertificationList extends React.Component<
  ICertificationListProps,
  ICertificationListState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      totalPrice: countTotalPrice(this.props.tasks, []),
      visibleTasks: this.props.tasks,
    };
  }

  get columns() {
    return getColumns(this.state.totalPrice, this.props.stages[0]);
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.tasks !== this.props.tasks) {
      this.setState({ visibleTasks: this.props.tasks });
    }
    if (prevProps.payments !== this.props.payments) {
      this.setState({
        totalPrice: countTotalPrice(this.props.tasks, this.props.payments),
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
            dataType="tasks"
            update={this.setState.bind(this)}
          />
        </div>
      </div>
      <ReactTable
        data={this.state.visibleTasks}
        columns={this.columns}
        defaultSorted={[
          {
            id: 'createdDate',
            desc: true,
          },
        ]}
        noDataText="data is loading"
        className="table"
        getTrProps={this.getTrProps}
        defaultPageSize={20}
      />
    </>
  );
}

const mapStateToProps = ({ main }: RootState) => ({
  tasks: main.filteredTasks,
  payments: main.payments,
});

// @ts-ignore
export default connect(mapStateToProps)(CertificationList);
