import { useState } from 'react';
import { useAppSelector } from 'store/hooks';

interface IColumnFilterProps {
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

const ColumnFilter = ({ dataType, update }: IColumnFilterProps) => {
  const [searchFor, setSearchFor] = useState('');
  const dataToFilter = useAppSelector(({ main }) =>
    dataType === 'tasks' ? main.filteredTasks : main.filteredItems
  );

  return (
    <input
      type="text"
      className="form-control"
      placeholder="search by title"
      value={searchFor}
      onChange={({ currentTarget: { value } }) => {
        const visibleTasks = filter(value, dataToFilter, dataType);
        setSearchFor(value);
        update(visibleTasks);
      }}
    />
  );
};

export default ColumnFilter;
