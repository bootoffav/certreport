import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Error404Page } from 'tabler-react';
import CertificationList from '../Lists/Certification/CertificationList';
import Animated from 'components/Animated';
import ErrorBoundary from 'ErrorBoundary';
import {
  changeFilteredItems,
  changeFilteredTasks,
} from 'store/slices/mainSlice';
import filter from './filter';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { isEqual } from 'lodash';

const NavBar = lazy(() => import('./NavBar'));
const Dashboard = lazy(() => import('../Dashboard/Dashboard'));
const Form = lazy(() => import('../Form/Form'));
const ExpiringCerts = lazy(() => import('../ExpiringCerts/ExpiringCerts'));
const ItemInCertifications = lazy(
  () => import('../ItemInCertifications/ItemInCertifications')
);
const ItemList = lazy(() => import('../Lists/ItemList/ItemList'));

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
  } = useAppSelector(
    ({ main }) => ({
      stages: main.stages,
      allItems: main.allItems,
      allTasks: main.allTasks,
      activeBrands: main.activeBrands,
      startDate: main.startDate,
      endDate: main.endDate,
      activeTestingCompanies: main.activeTestingCompanies,
      activeStandards: main.activeStandards,
      additionalStandardFilterTaskList: main.additionalStandardFilterTaskList,
    }),
    (left, right) => isEqual(left, right)
  );

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
    <BrowserRouter>
      <Suspense>
        <Routes>
          <Route path="/" element={<NavBar />}>
            <Route
              path="/dashboard"
              element={<Animated children={<Dashboard />} />}
            />
            <Route
              path="/"
              element={<Animated children={<CertificationList />} />}
            />
            <Route
              path="/expiringcerts"
              element={<Animated children={<ExpiringCerts />} />}
            />
            <Route
              path="/items"
              element={<Animated children={<ItemList />} />}
            />
            <Route
              path="/item/:item"
              element={<Animated children={<ItemInCertifications />} />}
            />
            <Route path="/add" element={<Animated children={<Form />} />} />
            <Route
              path="/edit/:taskId"
              element={
                <ErrorBoundary
                  children={
                    <Animated>
                      <Form />
                    </Animated>
                  }
                />
              }
            />
          </Route>
          <Route path="*" element={<Error404Page />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default Main;
