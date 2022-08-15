import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Error404Page } from 'tabler-react';
import CertificationList from '../Lists/Certification/CertificationList';
import { ItemList } from '../Lists/ItemList/ItemList';
import Form from '../Form/Form';
import Dashboard from '../Dashboard/Dashboard';
import ExpiringCerts from '../ExpiringCerts/ExpiringCerts';
import ErrorBoundary from 'ErrorBoundary';
import NavBar from './NavBar';
import { StageShortNames } from '../StageShortNames/StageShortNames';
import { ItemInCertifications } from '../ItemInCertifications/ItemInCertifications';
import {
  changeUpdated,
  changeItems,
  changeTasks,
  changeFilteredItems,
  changeFilteredTasks,
} from 'store/slices/mainSlice';
import fetchPayments from 'store/slices/PaymentsThunk';
import { Items } from 'Item/Item';
/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import dataFetcher from 'workerize-loader!../../workers/dataFetcher';
import AppLoaderUI from 'components/AppLoaderUI';
import filter from './filter';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { TaskState } from 'Task/Task.interface';

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

function Main() {
  const dispatch = useAppDispatch();
  const {
    stages,
    allItems,
    allTasks,
    activeBrands,
    startDate,
    endDate,
    activeTestingCompanies,
    activeStandards,
    additionalStandardFilterTaskList,
    updated,
  } = useAppSelector(({ main }) => ({
    stages: main.stages,
    allItems: main.allItems,
    allTasks: main.allTasks,
    activeBrands: main.activeBrands,
    startDate: main.startDate,
    endDate: main.endDate,
    activeTestingCompanies: main.activeTestingCompanies,
    activeStandards: main.activeStandards,
    additionalStandardFilterTaskList: main.additionalStandardFilterTaskList,
    updated: main.updated,
  }));

  useEffect(() => {
    (async () => {
      const tasks = await getTasks();
      const items = Items(tasks);
      dispatch(changeTasks(tasks));
      dispatch(fetchPayments());
      dispatch(changeItems(items));
      const { filteredItems, filteredTasks } = filter(tasks, items, {
        additionalStandardFilterTaskList,
        activeTestingCompanies,
        activeStandards,
        activeBrands,
        stages,
        startDate,
        endDate,
      });
      dispatch(changeFilteredItems(filteredItems));
      dispatch(changeFilteredTasks(filteredTasks));
      dispatch(changeUpdated(true));
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const { filteredItems, filteredTasks } = filter(allTasks, allItems, {
      additionalStandardFilterTaskList,
      activeTestingCompanies,
      activeStandards,
      activeBrands,
      stages,
      startDate,
      endDate,
    });
    dispatch(changeFilteredItems(filteredItems));
    dispatch(changeFilteredTasks(filteredTasks));
  }, [
    endDate,
    startDate,
    activeBrands,
    stages,
    activeStandards,
    additionalStandardFilterTaskList,
    activeTestingCompanies,
    allTasks,
    dispatch,
    allItems,
  ]);

  return updated ? (
    <Router>
      <div className="container-fluid">
        <NavBar />
        <Switch>
          <Route exact path="/dashboard" component={Dashboard} />
          <Route
            exact
            path="/"
            render={() => (
              <>
                <CertificationList />
                <StageShortNames />
              </>
            )}
          />
          <Route exact path="/expiringcerts" render={() => <ExpiringCerts />} />
          <Route exact path="/items" component={ItemList} />
          <Route exact path="/item/:item" component={ItemInCertifications} />
          <Route exact path="/add" component={Form} />
          <Route
            exact
            path="/edit/:taskId"
            render={({ match }) => (
              <ErrorBoundary children={<Form taskId={match.params.taskId} />} />
            )}
          />
          <Route path="*" component={Error404Page} />
        </Switch>
      </div>
    </Router>
  ) : (
    <AppLoaderUI />
  );
}

export default Main;
