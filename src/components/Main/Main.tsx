import { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { intersection, isEqual } from 'lodash';
import { Error404Page } from 'tabler-react';
import CacheManager from 'CacheManager';
import { CertificationList } from '../Lists/Certification/CertificationList';
import { ItemList } from '../Lists/ItemList/ItemList';
import Form from '../Form/Form';
import { Dashboard } from '../Dashboard/Dashboard';
import ExpiringCerts from '../ExpiringCerts/ExpiringCerts';
import ErrorBoundary from 'ErrorBoundary';
import NavBar from './NavBar';
import { StageShortNames } from '../StageShortNames/StageShortNames';
import { ItemInCertifications } from '../ItemInCertifications/ItemInCertifications';
import { isMainHeaderAllowed } from 'helpers';

class Main extends Component {
  cache = new CacheManager();
  state = {
    stages: ['all'],
    allTasks: [],
    allItems: [],
    filteredTasks: [],
    filteredItems: [],
    updated: false,
    startDate: undefined,
    endDate: undefined,
    activeBrands: ['XMT', 'XMS', 'XMF'],
    activeTestingCompanies: ['all'],
    activeStandards: ['All'],
    additionalStandardFilterTaskList: undefined,
  };

  async componentDidMount() {
    if (isMainHeaderAllowed(window.location.pathname)) {
      const applyUpdate = async ({ tasks, items }: any) => {
        return await this.setState({
          allTasks: tasks,
          filteredTasks: tasks,
          allItems: items,
          filteredItems: items,
        });
      };

      const markUpdated = () => this.setState({ updated: true });

      await this.cache.doUpdate();
      await this.cache.getCache().then(applyUpdate).then(markUpdated);
      this.filter();
    }
  }

  componentDidUpdate(_: any, prevState: any) {
    if (
      prevState.startDate !== this.state.startDate ||
      prevState.endDate !== this.state.endDate ||
      !isEqual(prevState.activeBrands, this.state.activeBrands) ||
      !isEqual(prevState.stages, this.state.stages) ||
      !isEqual(prevState.activeStandards, this.state.activeStandards) ||
      !isEqual(
        prevState.additionalStandardFilterTaskList,
        this.state.additionalStandardFilterTaskList
      ) ||
      !isEqual(
        prevState.activeTestingCompanies,
        this.state.activeTestingCompanies
      )
    ) {
      this.filter();
    }
  }

  filter() {
    let {
      allTasks,
      allItems,
      activeBrands,
      activeStandards,
      startDate,
      endDate,
      activeTestingCompanies,
      additionalStandardFilterTaskList,
    } = this.state;

    function brandFilteringFunc({ brand }: any) {
      return brand === '' && activeBrands.includes('No brand')
        ? true
        : activeBrands.includes(brand);
    }

    const testingCompanyFilteringFunc = ({ testingCompany }: any) => {
      testingCompany = testingCompany.split(' ')[0].toLowerCase();
      return activeTestingCompanies.includes(testingCompany);
    };

    // brandfiltering for Certification Tasks
    let filteredTasks = allTasks.filter(({ state }: any) =>
      brandFilteringFunc(state)
    );

    // brandfiltering for Items
    let filteredItems = allItems.filter(brandFilteringFunc);

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
      if (activeStandards[0] !== 'All') {
        filteredTasks = filteredTasks.filter((task: any) => {
          const standards = task.state.standards.split(', ');
          return intersection(standards, activeStandards).length;
        });
      }
    }

    // standardFiltering for Items
    if (activeStandards[0] !== 'All') {
      filteredItems = filteredItems.filter(
        ({ standards }) => intersection(standards, activeStandards).length
      );
    }

    // datefiltering
    if (startDate && endDate) {
      filteredTasks = filteredTasks.filter((task: any) => {
        const comparingDate = new Date(task.createdDate);
        // @ts-ignore
        return startDate < comparingDate && endDate > comparingDate;
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

    this.setState({
      filteredTasks: filteredTaskswithStage,
      filteredItems,
    });
  }

  render() {
    return (
      <Router>
        <div className="container-fluid">
          <NavBar
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            update={this.setState.bind(this)}
            updated={this.state.updated}
          />
          <Switch>
            <Route
              exact
              path="/dashboard"
              render={() => (
                <Dashboard
                  tasks={this.state.filteredTasks}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                />
              )}
            />
            <Route
              exact
              path="/"
              render={() => (
                <>
                  <CertificationList
                    tasks={this.state.filteredTasks}
                    update={this.setState.bind(this)}
                    stages={this.state.stages}
                  />
                  <StageShortNames />
                </>
              )}
            />
            <Route
              exact
              path="/expiringcerts"
              render={() => <ExpiringCerts tasks={this.state.filteredTasks} />}
            />
            <Route
              exact
              path="/items"
              render={() => <ItemList items={this.state.filteredItems} />}
            />
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

export { Main };
