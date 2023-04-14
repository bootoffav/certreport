import { Link } from 'react-router-dom';
import { useState } from 'react';
import ReactTable, { CellInfo } from 'react-table';
import ColumnFilter from '../Filters/ColumnFilter';
import type { ItemType, taskOfItem } from 'Item/Item';
import { Grid, Tooltip } from 'tabler-react';
import { useAppSelector } from 'store/hooks';

const columns = [
  {
    // 0
    Header: '#',
    id: 'position',
    Cell: (cell: CellInfo) => cell.page * cell.pageSize + cell.viewIndex + 1,
    width: 40,
  },
  {
    // 1
    Header: 'Item',
    id: 'item',
    accessor: 'article',
    Cell: ({ value }: CellInfo) => (
      <Tooltip content="Item's relevant certs" placement="right">
        <Link to={`/item/${encodeURIComponent(value)}/`}>{value}</Link>
      </Tooltip>
    ),
    width: 150,
  },
  {
    // 2
    Header: 'Brand',
    id: 'brand',
    accessor: 'brand',
    width: 50,
  },
  {
    // 3
    Header: 'Standards',
    id: 'standards',
    accessor: 'standards',
    width: 450,
    Cell: ({ value }: CellInfo) => value.join(', '),
  },
  {
    // 4
    Header: 'Certifications',
    id: 'tasks',
    accessor: 'tasks',
    Cell: ({ value: taskList }: CellInfo) => (
      <Tooltip content="links to B24 tasks" placement="left">
        <div>
          {taskList.map(({ id, title }: taskOfItem, index: number) => (
            <span key={id}>
              &nbsp;
              <a
                href={`${process.env.REACT_APP_B24_HOST}/company/personal/user/460/tasks/task/view/${id}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
                {taskList.length !== index + 1 && ','}
              </a>
            </span>
          ))}
        </div>
      </Tooltip>
    ),
  },
];

function ItemList() {
  let { filteredItems: items } = useAppSelector(({ main }) => main);
  const [visibleTasks, setVisibleTasks] = useState<ItemType[]>(items);

  return (
    <Grid.Row>
      <Grid.Col>
        <ColumnFilter
          update={(visibleTasks: any) => setVisibleTasks(visibleTasks)}
          dataType="items"
        />
        <ReactTable
          data={visibleTasks}
          columns={columns}
          className="-highlight table"
          defaultPageSize={20}
        />
      </Grid.Col>
    </Grid.Row>
  );
}

export default ItemList;
