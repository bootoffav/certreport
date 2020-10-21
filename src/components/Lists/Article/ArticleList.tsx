import { useEffect, useState } from 'react';
import ReactTable from 'react-table';
import { ColumnFilter } from '../Filters/ColumnFilter';
import type { ProductType } from '../../../Product/Product';
import { Grid, Tooltip } from 'tabler-react';

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
    Header: 'Article',
    id: 'article',
    accessor: 'article',
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
    Cell: ({ value }: any) => value.join(', '),
  },
  {
    // 4
    Header: 'Certifications',
    id: 'tasks',
    accessor: 'tasks',
    Cell: ({ value }: any) => {
      return (
        <Tooltip content="links to B24 tasks" placement="left">
          <div>
            {value.map(({ id, title }: any, index: number) => (
              <span key={id}>
                &nbsp;
                <a
                  href={`https://xmtextiles.bitrix24.ru/company/personal/user/460/tasks/task/view/${id}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {title}
                  {value.length !== index + 1 && ','}
                </a>
              </span>
            ))}
          </div>
        </Tooltip>
      );
    },
  },
];

interface ArticleListProps {
  products: ProductType[];
}

const ArticleList = ({ products }: ArticleListProps) => {
  const [visibleData, setVisibleData] = useState(products);

  useEffect(() => setVisibleData(products), [products]);

  return (
    <Grid.Row>
      <Grid.Col width="8" offset="2">
        <ColumnFilter
          dataToFilter={products}
          update={setVisibleData}
          filteringDataType="products"
        />
        <ReactTable
          data={visibleData}
          columns={columns}
          resolveData={(data: ProductType[], i = 1) => {
            return data.map((row: any) => {
              row.position = i++;
              return row;
            });
          }}
          className="-highlight table"
          defaultPageSize={20}
        />
      </Grid.Col>
    </Grid.Row>
  );
};

export { ArticleList };
