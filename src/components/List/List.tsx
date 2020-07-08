import React from 'react';
import ReactTable from 'react-table';
import { Button } from 'tabler-react';
import Task from '../../Task/Task';
import { getColumns } from './columns';
import StageFilter from './Filters/StageFilter';
// import DateFilter from './Filters/DateFilter';
import ColumnFilter from './Filters/ColumnFilter';
import ListExport from '../Export/PDF/ListExport';

import './List.css';
import '../../css/style.css';
import { countTotalPrice } from '../../helpers';

interface IListState {
    visibleData: any[];
    totalPrice: number;
    sortedData: Task[] | undefined;
    stage: string;
    startDate?: Date;
    endDate?: Date;
    columnFilterValue: string;
}

export default class List extends React.Component<{ allTasks: any; allProducts: any; staleData: boolean; }> {
    state: IListState = {
        visibleData: [],
        columnFilterValue: '',

        //used for Task PDF list (ejected out of react-table ref)
        sortedData: undefined,
        totalPrice: 0,
        stage: 'all'
  };
  ref: any;

  get columns() {
    return getColumns(this.state.totalPrice, this.state.stage);
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

    resetFilters = () => {
        this.setState({
            startDate: undefined,
            endDate: undefined,
            stage: 'all',
            columnFilterValue: ''
        })
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        if (prevProps.allTasks !== this.props.allTasks) {
            this.updateState();
            this.resetFilters();
        }
    }

  updateState = () => {
      const totalPrice = countTotalPrice(this.props.allTasks);
        this.setState({
            totalPrice,
            visibleData: this.props.allTasks
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
                <div className="mr-2">
                    <StageFilter
                        tasks={this.props.allTasks}
                        allProducts={this.props.allProducts}
                        update={this.setState.bind(this)}
                    />
                </div>
                    <ColumnFilter
                        value={this.state.columnFilterValue}
                        tasks={this.props.allTasks}
                        allProducts={this.props.allProducts}
                        requiredStage={this.state.stage}
                        update={this.setState.bind(this)}
                    />
            </div>
            <div className="d-flex">
                <List.State staleData={this.props.staleData} />
                    <ListExport
                        tasks={this.state.visibleData}
                        columns={this.columns}
                        stage={this.state.stage}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                    />
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