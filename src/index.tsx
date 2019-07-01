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

const App: React.FunctionComponent = () => {
  initApp();
  return (
    <div className="container-fluid">
      <Router>
        <>
          <nav className="rounded-bottom navbar navbar-light shadow">
            <div className="container-fluid d-flex">
              <a className="navbar-brand" href="/">
                <img src="/img/logo.png" width="150" alt="Site logo"/>
              </a>
              <span className="navbar-text">
                <a href="/">XMT XMF XMS fabrics certification processes gathered together in one place!</a>
              </span>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink exact to="/add">Add cert</NavLink>
                </li>
              </ul>
            </div>
          </nav>
          <Switch>
            <Route exact path="/" component={List} />
            <Route exact path="/add" component={Form} />
            <Route exact path="/edit/:id" component={Form} />
          </Switch>
        </>
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