import { BrowserRouter } from 'react-router-dom';
import ReactTable from 'react-table';
import { getColumns } from '../Lists/Certification/columns';
import { countTotalPrice } from 'helpers';
import { render } from 'react-dom';
import { TaskState } from 'Task/Task.interface';

function renderTable(tasks: TaskState[]) {
  render(
    <BrowserRouter>
      <ReactTable
        data={tasks}
        columns={getColumns(countTotalPrice(tasks), undefined)}
        defaultPageSize={18}
      />
      ,
    </BrowserRouter>,
    document.getElementById('tableOfDiagramSegment')
  );
}

export { renderTable };
