import { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { intersection, isEqual } from 'lodash';
import { Error404Page } from 'tabler-react';
import CacheManager from 'CacheManager';
import CertificationList from '../Lists/Certification/CertificationList';
import { ItemList } from '../Lists/ItemList/ItemList';
import Form from '../Form/Form';
import Dashboard from '../Dashboard/Dashboard';
import ExpiringCerts from '../ExpiringCerts/ExpiringCerts';
import ErrorBoundary from 'ErrorBoundary';
import NavBar from './NavBar';
import { StageShortNames } from '../StageShortNames/StageShortNames';
import { ItemInCertifications } from '../ItemInCertifications/ItemInCertifications';
import { ClientStorage } from '../../ClientStorage/ClientStorage';
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

class Main extends Component<any> {
  cache = new CacheManager();
  state = {
    stages: ['all'],
  };

  async componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchPayments());

    await this.cache.doUpdate();
    await ClientStorage.getData().then(({ tasks, items }: any) => {
      dispatch(changeTasks(tasks));
      dispatch(changeItems(items));
      dispatch(changeUpdated(true));
      const { filteredItems, filteredTasks } = this.filter(tasks, items);
      dispatch(changeFilteredItems(filteredItems));
      dispatch(changeFilteredTasks(filteredTasks));
    });
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    const { endDate, startDate, activeBrands, allTasks, allItems } = this.props;
    const { startDate: prevStartDate, endDate: prevEndDate } = prevProps;
    if (
      prevEndDate !== endDate ||
      prevStartDate !== startDate ||
      prevProps.activeBrands !== activeBrands ||
      !isEqual(prevState.stages, this.state.stages) ||
      !isEqual(prevProps.activeStandards, this.props.activeStandards) ||
      !isEqual(
        prevProps.additionalStandardFilterTaskList,
        this.props.additionalStandardFilterTaskList
      ) ||
      !isEqual(
        prevProps.activeTestingCompanies,
        this.props.activeTestingCompanies
      )
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
    const searchingStages = [...this.state.stages];

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
    return (
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
                    stages={this.state.stages}
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
              path="/edit/:id"
              render={(props) => (
                // @ts-expect-error
                <ErrorBoundary children={<Form {...props} />} />
              )}
            />
            <Route path="*" component={Error404Page} />
          </Switch>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = ({ main }: RootState) => ({
  allItems: main.allItems,
  allTasks: main.allTasks,
  activeBrands: main.activeBrands,
  startDate: main.startDate,
  endDate: main.endDate,
  activeTestingCompanies: main.activeTestingCompanies,
  activeStandards: main.activeStandards,
  additionalStandardFilterTaskList: main.additionalStandardFilterTaskList,
});

// @ts-ignore
export default connect(mapStateToProps)(Main);
