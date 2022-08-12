import { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { intersection, isEqual } from 'lodash';
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
    const { filteredItems, filteredTasks } = this.filter(tasks, items);
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
      const { filteredItems, filteredTasks } = this.filter(allTasks, allItems);
      this.props.dispatch(changeFilteredItems(filteredItems));
      this.props.dispatch(changeFilteredTasks(filteredTasks));
    }
  }

  filter(tasks: any, items: any) {
    let {
      additionalStandardFilterTaskList,
      activeTestingCompanies,
      activeStandards,
    } = this.props;

    const brandFilteringFunc = ({ brand }: any) => {
      return brand === '' && this.props.activeBrands.includes('No brand')
        ? true
        : this.props.activeBrands.includes(brand);
    };

    const testingCompanyFilteringFunc = ({ testingCompany }: any) => {
      testingCompany = testingCompany.split(' ')[0].toLowerCase();
      return activeTestingCompanies.includes(testingCompany);
    };

    // brandfiltering for Certification Tasks
    let filteredTasks = tasks.filter((task: any) => {
      return brandFilteringFunc(task.state);
    });

    // brandfiltering for Items
    let filteredItems = items.filter(brandFilteringFunc);

    if (activeTestingCompanies[0] !== 'all') {
      // testing company filtering for Certification Tasks
      filteredTasks = filteredTasks.filter(({ state }: any) =>
        testingCompanyFilteringFunc(state)
      );
      // testing company filtering for Items
      filteredItems = filteredItems.filter(testingCompanyFilteringFunc);
    }

    // standardfiltering for Certification Tasks
    if (additionalStandardFilterTaskList) {
      filteredTasks = filteredTasks.filter((task: any) =>
        // @ts-ignore
        additionalStandardFilterTaskList.includes(task.id)
      );
    } else {
      if (activeStandards[0] !== 'all') {
        filteredTasks = filteredTasks.filter((task: any) => {
          const standards = task.state.standards.split(', ');
          return intersection(standards, activeStandards).length;
        });
      }
    }

    // standardFiltering for Items
    if (activeStandards[0] !== 'all') {
      filteredItems = filteredItems.filter(
        ({ standards }: any) => intersection(standards, activeStandards).length
      );
    }

    const { startDate, endDate } = this.props;
    // datefiltering
    if (startDate && endDate) {
      const sDate = new Date(startDate);
      const eDate = new Date(endDate);
      filteredTasks = filteredTasks.filter((task: any) => {
        const comparingDate = new Date(task.createdDate);
        // @ts-ignore
        return sDate < comparingDate && eDate > comparingDate;
      });
    }

    //stageFiltering
    let filteredTaskswithStage: any = [];
    const searchingStages = [...this.props.stages];

    while (searchingStages.length) {
      let curStage = searchingStages.shift();
      switch (curStage) {
        case 'all':
          filteredTaskswithStage = [...filteredTasks];
          break;
        case 'overdue':
          filteredTaskswithStage = filteredTaskswithStage.concat(
            filteredTasks.filter((t: any) => t.overdue)
          );
          break;
        case 'ongoing':
          filteredTaskswithStage = filteredTaskswithStage.concat(
            filteredTasks.filter(
              (t: any) => t.state.stage.match(/^(10|[0-8]\.)/) // all stages starting 0. - 8. and 10.
            )
          );
          break;
        default:
          const filteredTasksByCurrentStage = filteredTasks.filter(
            (t: any) => t.state.stage === curStage
          );

          filteredTaskswithStage = [
            ...filteredTaskswithStage,
            ...filteredTasksByCurrentStage,
          ];
      }
    }

    return {
      filteredTasks: filteredTaskswithStage,
      filteredItems,
    };
  }

  render() {
    return this.props.updated ? (
      <Router>
        <div className="container-fluid">
          <NavBar />
          <Switch>
            <Route
              exact
              path="/dashboard"
              render={() => (
                // @ts-ignore
                <Dashboard />
              )}
            />
            <Route
              exact
              path="/"
              render={() => (
                <>
                  <CertificationList
                    // @ts-ignore
                    update={this.setState.bind(this)}
                    // @ts-ignore
                  />
                  <StageShortNames />
                </>
              )}
            />
            <Route
              exact
              path="/expiringcerts"
              render={() => <ExpiringCerts />}
            />
            <Route exact path="/items" render={() => <ItemList />} />
            <Route
              exact
              path="/item/:item"
              render={({ match }) => {
                return <ItemInCertifications {...match.params} />;
              }}
            />
            <Route
              exact
              path="/add"
              render={(props) => (
                // @ts-expect-error
                <Form {...props} />
              )}
            />
            <Route
              exact
              path="/edit/:taskId"
              render={(props) => (
                // @ts-expect-error
                <ErrorBoundary children={<Form {...props} />} />
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
