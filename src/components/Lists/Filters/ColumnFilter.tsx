import { useState } from 'react';

interface IColumnFilterProps {
  dataToFilter: any; // tasks or products
  filteringDataType: 'tasks' | 'products';
  update: any;
}

const searchOptions: {
  [key: string]: any;
} = {
  tasks: {
    title: 'Task',
    testReport: 'Test report',
    certificate: 'Certificate',
    standards: 'Standards',
    article: 'Article',
  },
  products: {
    article: 'Article',
    standards: 'Standards',
    tasks: 'Certifications',
  },
};

function filter(
  value: string,
  searchByColumn: string,
  dataToFilter: any,
  typeOfFilteringData: string
) {
  const valueLowered = value.toLowerCase();

  const filterProducts = (product: any) => {
    switch (searchByColumn) {
      case 'article':
        return product.article.toLowerCase().includes(valueLowered);
      case 'standards':
        return product.standards
          .join(', ')
          .toLowerCase()
          .includes(valueLowered);
      case 'tasks':
        const titles = product.tasks.map((task: any) => task.title);
        return titles.join(', ').toLowerCase().includes(valueLowered);
    }
  };

  const filterTasks = (task: any) =>
    searchByColumn === 'title'
      ? task[searchByColumn].toLowerCase().includes(valueLowered)
      : task.state[searchByColumn].toLowerCase().includes(valueLowered);

  return typeOfFilteringData === 'products'
    ? dataToFilter.filter(filterProducts)
    : dataToFilter.filter(filterTasks);
}

const ColumnFilter = (props: IColumnFilterProps) => {
  const [value, setValue] = useState('');
  const [searchByColumn, setSearchByColumn] = useState(
    props.filteringDataType === 'products' ? 'article' : 'title'
  );

  const prop = props.filteringDataType;
  return (
    <div className="mr-1 input-group">
      <input
        type="text"
        className="form-control"
        placeholder="search"
        value={value}
        onChange={({ currentTarget }: React.SyntheticEvent) => {
          const value = (currentTarget as HTMLInputElement).value;
          const visibleData = filter(
            value,
            searchByColumn,
            props.dataToFilter,
            props.filteringDataType
          );
          setValue(value);
          props.update(visibleData);
        }}
      />
      <div className="input-group-append">
        <button
          className="btn btn-outline-success dropdown-toggle"
          data-toggle="dropdown"
        >
          {searchOptions[prop][searchByColumn]}
        </button>
        <div className="dropdown-menu">
          {Object.entries(searchOptions[prop]).map(([key, label]: any) => (
            <button
              key={key}
              className="dropdown-item"
              onClick={() => {
                setValue('');
                setSearchByColumn(key);
                props.update(props.dataToFilter);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export { ColumnFilter };
