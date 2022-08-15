import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Error404Page } from 'tabler-react';
import CertificationList from '../Lists/Certification/CertificationList';
import { ItemList } from '../Lists/ItemList/ItemList';
import Form from '../Form/Form';
import Animated from 'components/Animated';
import Dashboard from '../Dashboard/Dashboard';
import ExpiringCerts from '../ExpiringCerts/ExpiringCerts';
import ErrorBoundary from 'ErrorBoundary';
import NavBar from './NavBar';
import { StageShortNames } from '../StageShortNames/StageShortNames';
import { ItemInCertifications } from '../ItemInCertifications/ItemInCertifications';
import {
  changeFilteredItems,
  changeFilteredTasks,
} from 'store/slices/mainSlice';
import filter from './filter';
import { useAppDispatch, useAppSelector } from 'store/hooks';

function Main() {
  console.log('main');
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
  }));

  useEffect(() => {
    console.log('main useEffect');
    // const { filteredItems, filteredTasks } = filter(allTasks, allItems, {
    //   additionalStandardFilterTaskList,
    //   activeTestingCompanies,
    //   activeStandards,
    //   activeBrands,
    //   stages,
    //   startDate,
    //   endDate,
    // });
    // dispatch(changeFilteredItems(filteredItems));
    // dispatch(changeFilteredTasks(filteredTasks));
  }, [
    additionalStandardFilterTaskList,
    activeTestingCompanies,
    activeStandards,
    activeBrands,
    stages,
    startDate,
    endDate,
    allTasks,
    dispatch,
    allItems,
  ]);

  return (
    <Router>
      <div className="container-fluid">
        <NavBar />
        <Switch>
          <Route
            exact
            path="/dashboard"
            render={() => <Animated children={<Dashboard />} />}
          />
          <Route
            exact
            path="/"
            render={() => (
              <Animated
                children={[
                  <CertificationList />,
                  // <StageShortNames key={1} />,
                ]}
              />
            )}
          />
          <Route
            exact
            path="/expiringcerts"
            render={() => <Animated children={<ExpiringCerts />} />}
          />
          <Route
            exact
            path="/items"
            render={() => <Animated children={<ItemList />} />}
          />
          <Route
            exact
            path="/item/:item"
            render={() => <Animated children={<ItemInCertifications />} />}
          />
          <Route
            exact
            path="/add"
            render={() => <Animated children={<Form />} />}
          />
          <Route
            exact
            path="/edit/:taskId"
            render={({ match }) => (
              <ErrorBoundary
                children={
                  <Animated>
                    <Form taskId={match.params.taskId} />
                  </Animated>
                }
              />
            )}
          />
          <Route path="*" component={Error404Page} />
        </Switch>
      </div>
    </Router>
  );
}

export default Main;
