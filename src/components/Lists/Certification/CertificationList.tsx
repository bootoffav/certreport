import * as React from 'react';
import ReactTable from 'react-table';
import { getColumns } from './columns';
import { StageFilter } from '../Filters/StageFilter';
import { ColumnFilter } from '../Filters/ColumnFilter';
import { ListExport } from 'components/Export/PDF/ListExport';
import { connect } from 'react-redux';

import './List.css';
import { countTotalPrice } from 'helpers';
import { RootState } from 'store/store';

interface ICertificationListState {
  visibleData: any[];
  totalPrice: number;
  startDate?: Date;
  endDate?: Date;
}

interface ICertificationListProps {
  tasks: any;
  update: any;
  stages: any;
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
    return getColumns(this.state.totalPrice, this.props.stages[0]);
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
            stage={this.props.stages[0]}
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
        noDataText="no rows found, or if it's first time loading please give it about 30 sec to finish"
        className="-highlight table"
        getTrProps={this.getTrProps}
        defaultPageSize={20}
      />
    </>
  );
}

const mapStateToProps = ({ main }: RootState) => {
  return { tasks: main.filteredTasks };
};

// @ts-ignore
export default connect(mapStateToProps)(CertificationList);
