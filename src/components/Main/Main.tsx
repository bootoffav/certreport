import { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { isEqual } from 'lodash';
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
import type { RootState } from 'store/store';
import { connect } from 'react-redux';
import fetchPayments from 'store/slices/PaymentsThunk';
import { Items } from 'Item/Item';
/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import dataFetcher from 'workerize-loader!../../workers/dataFetcher';
import AppLoaderUI from 'components/AppLoaderUI';
import filter from './filter';

const worker = dataFetcher();

const getTasks = async () =>
  new Promise<any[]>((resolve) => {
    worker.onmessage = ({ data }: MessageEvent) => {
      if (Array.isArray(data)) {
        return resolve(data);
      }
    };
    worker.getTasks();
  });

class Main extends Component<any> {
  async componentDidMount() {
    const { dispatch } = this.props;

    const tasks = await getTasks();
    const items = Items(tasks);
    dispatch(changeTasks(tasks));
    dispatch(fetchPayments());
    dispatch(changeItems(items));
    const { filteredItems, filteredTasks } = filter(tasks, items, this.props);
    dispatch(changeFilteredItems(filteredItems));
    dispatch(changeFilteredTasks(filteredTasks));
    dispatch(changeUpdated(true));
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    const { endDate, startDate, activeBrands, allTasks, allItems } = this.props;
    const { startDate: prevStartDate, endDate: prevEndDate } = prevProps;
    if (
      prevEndDate !== endDate ||
      prevStartDate !== startDate ||
      prevProps.activeBrands !== activeBrands ||
      !isEqual(prevProps.stages, this.props.stages) ||
      !isEqual(prevProps.activeStandards, this.props.activeStandards) ||
      !isEqual(
        prevProps.additionalStandardFilterTaskList,
        this.props.additionalStandardFilterTaskList
      ) ||
      !isEqual(
        prevProps.activeTestingCompanies,
        this.props.activeTestingCompanies
      ) ||
      !isEqual(prevProps.allTasks, this.props.allTasks) // case when payments added to allTasks in redux-store
    ) {
      const { filteredItems, filteredTasks } = filter(
        allTasks,
        allItems,
        this.props
      );
      this.props.dispatch(changeFilteredItems(filteredItems));
      this.props.dispatch(changeFilteredTasks(filteredTasks));
    }
  }

  render() {
    return this.props.updated ? (
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
                  <CertificationList update={this.setState.bind(this)} />
                  <StageShortNames />
                </>
              )}
            />
            <Route
              exact
              path="/expiringcerts"
              render={() => <ExpiringCerts />}
            />
            <Route exact path="/items" component={ItemList} />
            <Route exact path="/item/:item" component={ItemInCertifications} />
            <Route exact path="/add" component={Form} />
            <Route
              exact
              path="/edit/:taskId"
              render={({ match }) => (
                <ErrorBoundary
                  children={<Form taskId={match.params.taskId} />}
                />
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
}

const mapStateToProps = ({ main }: RootState) => ({
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
});

// @ts-ignore
export default connect(mapStateToProps)(Main);
