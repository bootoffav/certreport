import { useAppSelector, useAppDispatch } from 'store/hooks';
import Main from 'components/Main/Main';
import AppLoader from 'components/AppLoader';
import { TaskState } from 'Task/Task.interface';
/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import dataFetcher from 'workerize-loader!../../workers/dataFetcher';
import { useEffect } from 'react';
import Items from 'Item/Item';
import {
  changeUpdated,
  changeItems,
  changeTasks,
} from 'store/slices/mainSlice';
import fetchPayments from 'store/slices/PaymentsThunk';

const worker = dataFetcher();

const getTasks = async () =>
  new Promise<TaskState[]>((res) => {
    worker.onmessage = ({ data }: MessageEvent) => {
      if (Array.isArray(data)) {
        return res(data);
      }
    };
    worker.getTasks();
  });

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    (async () => {
      const tasks = await getTasks();
      // dispatch(changeTasks(tasks));
      dispatch(fetchPayments());

      // const items = Items(tasks);
      // dispatch(changeItems(items));

      dispatch(changeUpdated(true));
    })();
  }, [dispatch]);

  const updated = useAppSelector(({ main }) => main.updated);
  return updated ? <Main /> : <AppLoader />;
}

export default App;
