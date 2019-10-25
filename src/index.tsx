import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'open-iconic/font/css/open-iconic-bootstrap.min.css';
import 'react-table/react-table.css';
import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, NavLink, Switch } from "react-router-dom";
import netlifyIdentity from 'netlify-identity-widget';
import './css/style.css';
import { initApp } from './defaults';
import { Error404Page } from 'tabler-react';
import CacheManager from './CacheManager';
import List from './components/List/List';
import ErrorBoundary from './ErrorBoundary';

const Form = lazy(() => import('./components/Form/Form'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));

class App extends React.Component {
  cache = new CacheManager();

  state = {
    allTasks: this.cache.staleData ? this.cache.getFromCache(localStorage) : this.cache.getFromCache(sessionStorage)
  };

  componentDidMount() {
    if (this.cache.staleData) {
      this.cache.getFromAPI()
        .then(this.cache.setCaches)
        .then(tasks => {
          this.setState({ allTasks: tasks });
          return tasks;
        })
    }
  }

  static Loading = () => 
    <div className="spinner-grow" role="status">
      <span className="sr-only">Loading...</span>
    </div>

  render() {
    initApp();
    return (
      <div className="container-fluid">
        <Router>
          <Suspense fallback={<App.Loading />}>
            <nav className="rounded-bottom navbar navbar-light shadow">
              <div className="container-fluid d-flex">
                <NavLink className="navbar-brand" exact to="/dashboard">
                  <img src="/img/logo.png" width={150} alt="site-logo" />
                </NavLink>
                <span className="navbar-text">
                  <NavLink to="/">
                    XMT XMF XMS fabrics certification processes gathered together in one place!
                  </NavLink>
                </span>
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <NavLink exact to="/add">Add cert</NavLink>
                  </li>
                </ul>
              </div>
            </nav>
            <Switch>
              <Route exact path="/dashboard" render={() => <Dashboard tasks={this.state.allTasks} />} />
              <Route exact path="/" render={() => <List tasks={this.state.allTasks} staleData={this.cache.staleData}/>} />
              <Route exact path="/add" render={(props) => <Form {...props} />} />
              <Route exact path="/edit/:id" render={(props) =>
                <ErrorBoundary>
                  <Form {...props} />
                </ErrorBoundary>
              } />
              <Route path="*" component={Error404Page} />
              </Switch>
          </Suspense>
        </Router>
      </div>
    );
  }
}


netlifyIdentity.init();
netlifyIdentity.on('login', user => {
  netlifyIdentity.close();
  ReactDOM.render(<App />, document.getElementById('root'));
});

netlifyIdentity.currentUser()
  ? ReactDOM.render(<App />, document.getElementById('root'))
  : netlifyIdentity.open('login');