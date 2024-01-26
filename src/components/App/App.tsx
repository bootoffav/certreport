import { useAppSelector, useAppDispatch } from '../../store/hooks';
import Main from '../Main/Main';
import AppLoader from '../AppLoader';
import getTasks from '../../workers/dataFetcher';
import { useEffect } from 'react';
import Items from '../../Item/Item';
import {
  changeUpdated,
  changeItems,
  changeTasks,
} from '../../store/slices/mainSlice';
import fetchPayments from '../App/fetchPayments';

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    (async () => {
      const tasks = await Promise.all([getTasks(), fetchPayments()]).then(
        ([tasks, payments]) => {
          return tasks.map((task) => ({
            ...task,
            state: {
              ...task.state,
              payments: payments[task.id] || [],
            },
          }));
        }
      );
      dispatch(changeTasks(tasks));
      dispatch(changeItems(Items(tasks)));

      dispatch(changeUpdated(true));
    })();
  }, [dispatch]);

  const updated = useAppSelector(({ main }) => main.updated);
  return updated ? (
    <div className="container-fluid">
      <Main />
    </div>
  ) : (
    <AppLoader />
  );
}

export default App;
