import { useEffect, useState } from 'react';
import ReactTable, { CellInfo } from 'react-table';
import { ColumnFilter } from '../Filters/ColumnFilter';
import type { ItemType, taskOfItem } from 'Item/Item';
import { Grid, Tooltip } from 'tabler-react';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const columns = [
  {
    // 0
    Header: '#',
    id: 'position',
    accessor: 'position',
    width: 40,
  },
  {
    // 1
    Header: 'Item',
    id: 'item',
    Cell: ({ original }: CellInfo) => (
      <Tooltip content="Item's relevant certs" placement="right">
        <a href={`/item/${encodeURIComponent(original.article)}/`}>
          {original.article}
        </a>
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

const ItemList = () => {
  const items = useSelector(({ main }: RootState) => main.filteredItems);
  const [visibleData, setVisibleData] = useState<ItemType[]>();

  useEffect(() => {
    setVisibleData(items);
  }, [items]);

  return (
    <Grid.Row>
      <Grid.Col>
        <ColumnFilter
          dataToFilter={items}
          update={setVisibleData}
          filteringDataType="items"
        />
        <ReactTable
          data={visibleData}
          columns={columns}
          resolveData={(data: ItemType[], i = 1) =>
            data.map((row) => ({ ...row, position: i++ }))
          }
          className="-highlight table"
          defaultPageSize={20}
        />
      </Grid.Col>
    </Grid.Row>
  );
};

export { ItemList };
