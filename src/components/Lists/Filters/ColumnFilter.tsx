import React from 'react';
import { useState } from 'react';

interface IColumnFilterProps {
  dataToFilter: any; // tasks or items
  filteringDataType: 'tasks' | 'items';
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
  items: {
    article: 'Article',
    standards: 'Standards',
    tasks: 'Certifications',
  },
};

function filter(
  value: string,
  searchByColumn: string,
  dataToFilter: any[],
  typeOfFilteringData: 'tasks' | 'items'
) {
  const valueLowered = value.toLowerCase();

  const filterItems = (item: any) => {
    switch (searchByColumn) {
      case 'article':
        return item.article.toLowerCase().includes(valueLowered);
      case 'standards':
        return item.standards.join(', ').toLowerCase().includes(valueLowered);
      case 'tasks':
        const titles = item.tasks.map((task: any) => task.title);
        return titles.join(', ').toLowerCase().includes(valueLowered);
    }
  };

  const filterTasks = (task: any) =>
    searchByColumn === 'title'
      ? task[searchByColumn].toLowerCase().includes(valueLowered)
      : task.state[searchByColumn].toLowerCase().includes(valueLowered);

  return typeOfFilteringData === 'items'
    ? dataToFilter.filter(filterItems)
    : dataToFilter.filter(filterTasks);
}

const ColumnFilter = ({
  filteringDataType,
  dataToFilter,
  update,
}: IColumnFilterProps) => {
  const [value, setValue] = useState('');
  const [searchByColumn, setSearchByColumn] = useState(
    filteringDataType === 'items' ? 'article' : 'title'
  );

  return (
    <div className="mr-1 input-group">
      <input
        type="text"
        className="form-control"
        placeholder="search"
        autoFocus
        value={value}
        onChange={({ currentTarget }: React.SyntheticEvent) => {
          const value = (currentTarget as HTMLInputElement).value;
          const visibleData = filter(
            value,
            searchByColumn,
            dataToFilter,
            filteringDataType
          );
          setValue(value);
          update(visibleData);
        }}
      />
      <div className="input-group-append">
        <button
          className="btn btn-outline-success dropdown-toggle"
          data-toggle="dropdown"
        >
          {searchOptions[filteringDataType][searchByColumn]}
        </button>
        <div className="dropdown-menu">
          {Object.entries(searchOptions[filteringDataType]).map(
            ([key, label]: any) => (
              <button
                key={key}
                className="dropdown-item"
                onClick={() => {
                  setValue('');
                  setSearchByColumn(key);
                  update(dataToFilter);
                }}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export { ColumnFilter };
