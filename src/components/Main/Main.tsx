import { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Error404Page } from 'tabler-react';
import CacheManager from '../../CacheManager';
import { CertificationList } from '../Lists/Certification/CertificationList';
import { ArticleList } from '../Lists/ArticleList/ArticleList';
import Form from '../Form/Form';
import Dashboard from '../Dashboard/Dashboard';
import ErrorBoundary from '../../ErrorBoundary';
import { NavBar } from './NavBar';
import { StageShortNames } from '../StageShortNames/StageShortNames';
import { ArticleInCertifications } from '../ArticleInCertifications/ArticleInCertifications';
import { isMainHeaderAllowed } from '../../helpers';

class Main extends Component {
  cache = new CacheManager();
  state = {
    allTasks: [],
    allProducts: [],
    filteredTasks: [],
    filteredProducts: [],
    updated: false,
    startDate: undefined,
    endDate: undefined,
    activeBrands: ['XMT', 'XMS', 'XMF'],
  };

  async componentDidMount() {
    if (isMainHeaderAllowed(window.location.pathname)) {
      const applyUpdate = async ({ tasks, products }: any) => {
        return await this.setState({
          allTasks: tasks,
          filteredTasks: tasks,
          allProducts: products,
          filteredProducts: products,
        });
      };

      const markUpdated = () => this.setState({ updated: true });

      await this.cache
        .getCache()
        .then(applyUpdate)
        .then(this.filter.bind(this));
      await this.cache.doUpdate();
      await this.cache.getCache().then(applyUpdate).then(markUpdated);
      this.filter();
    }
  }

  componentDidUpdate(_: any, prevState: any) {
    if (
      prevState.activeBrands !== this.state.activeBrands ||
      prevState.startDate !== this.state.startDate ||
      prevState.endDate !== this.state.endDate
    ) {
      this.filter();
    }
  }

  filter() {
    let {
      allTasks,
      allProducts,
      activeBrands,
      startDate,
      endDate,
    } = this.state;

    // brandfiltering for Tasks
    let filteredTasks = allTasks.filter((task: any) => {
      if (task.state.brand === '') {
        if (activeBrands.includes('No brand')) return true;
      }
      return activeBrands.includes(task.state.brand);
    });

    // brandfiltering for Products
    let filteredProducts = allProducts.filter((product: any) => {
      if (product.brand === '') {
        if (activeBrands.includes('No brand')) return true;
      }
      return activeBrands.includes(product.brand);
    });

    // datefiltering
    if (startDate && endDate) {
      filteredTasks = filteredTasks.filter((task: any) => {
        const comparingDate = new Date(task.state.certReceivedOnRealDate);
        // @ts-ignore
        return startDate < comparingDate && endDate > comparingDate;
      });
    }

    this.setState({
      filteredTasks,
      filteredProducts,
    });
  }

  render() {
    return (
      <Router>
        <div className="container-fluid">
          <NavBar
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            tasks={this.state.allTasks}
            update={this.setState.bind(this)}
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
                    updated={this.state.updated}
                  />
                  <StageShortNames />
                </>
              )}
            />
            <Route
              exact
              path="/articles"
              render={() => (
                <ArticleList products={this.state.filteredProducts} />
              )}
            />
            <Route
              exact
              path="/article/:article"
              render={({ match }) => {
                return <ArticleInCertifications {...match.params} />;
              }}
            />
            <Route
              exact
              path="/add"
              render={({ match }) => <Form match={match} />}
            />
            <Route
              exact
              path="/edit/:id"
              render={({ match }) => (
                <ErrorBoundary>
                  <Form match={match} />
                </ErrorBoundary>
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
