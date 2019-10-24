import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'open-iconic/font/css/open-iconic-bootstrap.min.css';
import 'react-table/react-table.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, NavLink, Switch } from "react-router-dom";
import Form from './components/Form/Form';
import List from './components/List/List';
import netlifyIdentity from 'netlify-identity-widget';
import './css/style.css';
import { initApp } from './defaults';
import { AppState, AppContext } from './AppState';
import Dashboard from './components/Dashboard/Dashboard';
import { Error404Page } from 'tabler-react';

const appState = new AppState();

const App: React.FunctionComponent = () => {
  initApp();
  return (
    <div className="container-fluid">
      <Router>
        <AppContext.Provider value={{
          allTasks: appState.allTasks
        }}>
          <nav className="rounded-bottom navbar navbar-light shadow">
            <div className="container-fluid d-flex">
              <NavLink className="navbar-brand" exact to="/dashboard">
                <img src="/img/logo.png" width={150} alt="site-logo"/>
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
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/" component={List} />
              <Route exact path="/add" component={Form} />
            <Route exact path="/edit/:id" component={Form} />
            <Route path="*" component={Error404Page} />
          </Switch>
          </AppContext.Provider>
      </Router>
    </div>
  );
}


netlifyIdentity.init();
netlifyIdentity.on('login', user => {
  netlifyIdentity.close();
  ReactDOM.render(<App />, document.getElementById('root'));
});

netlifyIdentity.currentUser()
  ? ReactDOM.render(<App />, document.getElementById('root'))
  : netlifyIdentity.open('login');