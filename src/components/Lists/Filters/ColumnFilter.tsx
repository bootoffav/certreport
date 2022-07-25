import React from 'react';
import { useState } from 'react';

interface IColumnFilterProps {
  dataToFilter: any; // tasks or items
  dataType: 'tasks' | 'items';
  update: any;
}

function filter(
  value: string,
  dataToFilter: any[],
  typeOfFilteringData: 'tasks' | 'items'
) {
  const valueLowered = value.toLowerCase();

  const filterItems = (item: any) => {
    const titles = item.tasks.map((task: any) => task.title);
    return titles.join(', ').toLowerCase().includes(valueLowered);
  };

  const filterTasks = (task: any) =>
    task['title'].toLowerCase().includes(valueLowered);

  return typeOfFilteringData === 'items'
    ? dataToFilter.filter(filterItems)
    : dataToFilter.filter(filterTasks);
}

const ColumnFilter = ({
  dataType,
  dataToFilter,
  update,
}: IColumnFilterProps) => {
  const [searchFor, setSearchFor] = useState('');

  return (
    <input
      type="text"
      className="form-control"
      placeholder="search by title"
      autoFocus
      value={searchFor}
      onChange={({ currentTarget: { value } }) => {
        const visibleTasks = filter(value, dataToFilter, dataType);
        setSearchFor(value);
        update({ visibleTasks });
      }}
    />
  );
};

export default ColumnFilter;
