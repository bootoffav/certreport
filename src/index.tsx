import 'bootstrap';
import "tabler-react/dist/Tabler.css";
import 'open-iconic/font/css/open-iconic-bootstrap.min.css';
import 'react-table/react-table.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, NavLink, Switch } from "react-router-dom";
import netlifyIdentity from 'netlify-identity-widget';
import './css/style.css';
import { initApp } from './defaults';
import { Error404Page } from 'tabler-react';
import CacheManager from './CacheManager';
import List from './components/List/List';
import Form from './components/Form/Form';
import Dashboard from './components/Dashboard/Dashboard';
import ErrorBoundary from './ErrorBoundary';
import { Products } from './Product/Product';
import BrandFilter from './components/List/Filters/BrandFilter';

initApp();

class App extends React.Component {
    cache: CacheManager;
    state: {
        allTasks: any;
        allProducts: any;
        brandFiltered: any;
    }

    constructor(props: any) {
        super(props);
        this.cache = new CacheManager();
        const fromCache = this.cache.staleData ? this.cache.getFromCache(localStorage) : this.cache.getFromCache(sessionStorage);
        this.state = {
            allTasks: fromCache.tasksFromCache,
            allProducts: fromCache.productsFromCache,
            brandFiltered: fromCache.tasksFromCache
        };
    }

  componentDidMount() {
    if (this.cache.staleData) {
      this.cache.getFromAPI() // get Tasks
        .then(Products) // parse Products
        .then(this.cache.setCaches)
        .then(({ tasks, products }) => this.setState({ allTasks: tasks, allProducts: products }));
    }
  }

  static Loading = () => 
    <div className="spinner-grow" role="status">
      <span className="sr-only">Loading...</span>
    </div>

    render() {
        return (
            <Router>
                <div className="container-fluid">
                    <div className="pl-1 pt-1 mb-1 rounded-bottom navbar-light d-flex justify-content-start">
                        <BrandFilter
                                tasks={this.state.allTasks}
                                update={this.setState.bind(this)}
                        />
                        <div className="container-fluid">
                            <div className="row">
                                <div className="offset-3 col-2 pt-1">
                                    <NavLink className="navbar-link" exact to="/dashboard">
                                        <p style={{ fontSize: '20px' }}>Dashboard</p>
                                    </NavLink>
                                </div>
                                <div className="col-2 pt-1">
                                    <NavLink className="navbar-link" to="/">
                                        <p style={{ fontSize: '20px' }}>Certification list</p>
                                    </NavLink>
                                </div>
                                <div className="ml-auto pr-2 pt-1">
                                    <NavLink exact to="/add">
                                        <p style={{ fontSize: '20px' }}>Add cert</p>
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Switch>
                        <Route exact path="/dashboard"
                            render={() => <Dashboard
                                tasks={this.state.brandFiltered}
                            />} />
                        <Route exact path="/" render={() => <List
                            allTasks={this.state.brandFiltered}
                            allProducts={this.state.allProducts}
                            staleData={this.cache.staleData}
                        />} />
                        <Route exact path="/add" render={({ match, location: { state } }) =>
                            <Form
                                match={match}
                                state={state} />}
                        />
                        <Route exact path="/edit/:id" render={({ match, location: { state } }) =>
                            <ErrorBoundary>
                                <Form
                                    match={match}
                                    state={state}
                                />
                            </ErrorBoundary>
                        } />
                        <Route path="*" component={Error404Page} />
                    </Switch>
                </div>
            </Router>);
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
