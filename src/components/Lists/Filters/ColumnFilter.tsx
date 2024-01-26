import { useState } from 'react';
import { useAppSelector } from '../../../store/hooks';

interface IColumnFilterProps {
  dataType: 'tasks' | 'items';
  update: any;
}

const ColumnFilter = ({ dataType, update }: IColumnFilterProps) => {
  const [searchFor, setSearchFor] = useState('');
  const dataToFilter = useAppSelector(({ main }) =>
    dataType === 'tasks' ? main.filteredTasks : main.filteredItems
  );

  function filter(searchThis: string) {
    const filterItems = ({ article }: any) => {
      return article.toLowerCase().includes(searchThis);
    };

    const filterTasks = (task: any) =>
      task['title'].toLowerCase().includes(searchThis);

    return dataToFilter.filter(
      dataType === 'items' ? filterItems : filterTasks
    );
  }

  return (
    <input
      type="text"
      className="form-control"
      placeholder={`search by ${dataType === 'items' ? 'item' : 'task name'}`}
      value={searchFor}
      onChange={({ currentTarget: { value: searchThis } }) => {
        const visibleTasks = filter(searchThis.toLowerCase());
        setSearchFor(searchThis);
        update(visibleTasks);
      }}
    />
  );
};

export default ColumnFilter;
