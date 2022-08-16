import { useAppSelector, useAppDispatch } from 'store/hooks';
import Main from 'components/Main/Main';
import AppLoader from 'components/AppLoader';
import getTasks from 'workers/dataFetcher';
import { useEffect } from 'react';
import Items from 'Item/Item';
import {
  changeUpdated,
  changeItems,
  changeTasks,
} from 'store/slices/mainSlice';
import fetchPayments from 'components/App/fetchPayments';

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
  return updated ? <Main /> : <AppLoader />;
}

export default App;
