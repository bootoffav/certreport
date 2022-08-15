import { useEffect, useState } from 'react';
import { useAppSelector } from 'store/hooks';
import ReactTable from 'react-table';
import { getColumns } from './columns';
import StageFilter from '../Filters/StageFilter';
import ColumnFilter from '../Filters/ColumnFilter';
import './List.css';
import { countTotalPrice } from 'helpers';

function CertificationList() {
  const { tasks, stages } = useAppSelector(({ main }) => ({
    tasks: main.filteredTasks,
    stages: main.stages,
  }));

  const [visibleTasks, setVisibleTasks] = useState(tasks);

  useEffect(() => {
    setVisibleTasks(tasks);
  }, [tasks]);

  const getTrProps = (_: any, rowInfo: any) => {
    if (rowInfo === undefined) {
      return {};
    }
    return rowInfo.original.overdue ? { className: 'missedDeadline' } : {};
  };

  return (
    <>
      <div className="d-flex mb-1">
        <div className="d-flex w-100">
          <div className="mr-2">
            <StageFilter />
          </div>
          <ColumnFilter
            dataType="tasks"
            update={(vt: any) => setVisibleTasks(vt)}
          />
        </div>
      </div>
      <ReactTable
        data={visibleTasks}
        columns={getColumns(countTotalPrice(visibleTasks), stages[0])}
        defaultSorted={[
          {
            id: 'createdDate',
            desc: true,
          },
        ]}
        noDataText="data is loading"
        className="table"
        getTrProps={getTrProps}
        defaultPageSize={20}
      />
    </>
  );
}

export default CertificationList;
