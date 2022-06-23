import { BrowserRouter } from 'react-router-dom';
import ReactTable from 'react-table';
import { getColumns } from '../Lists/Certification/columns';
import { countTotalPrice } from 'helpers';
import { render } from 'react-dom';

function renderTableOfDiagramSegment(
  checkedValue: string,
  param: string,
  tasks?: any,
  skipFilter?: boolean
) {
  if (['no product', 'no stage'].includes(checkedValue)) checkedValue = '';
  if (!skipFilter) {
    tasks = (tasks || this.props.tasks).filter(
      (t: any) => t.state[param] === checkedValue
    );
  }

  const totalPrice = countTotalPrice(tasks);
  render(
    <BrowserRouter>
      <ReactTable
        data={tasks}
        columns={getColumns(totalPrice, undefined)}
        defaultPageSize={10}
      />
      ,
    </BrowserRouter>,
    document.getElementById('tableOfDiagramSegment')
  );
}

export { renderTableOfDiagramSegment };
