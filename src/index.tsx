import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'open-iconic/font/css/open-iconic-bootstrap.min.css';
import 'react-table/react-table.css';
import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import Form from './components/Form/Form';
import List from './components/List/List';
import netlifyIdentity from 'netlify-identity-widget';
import './css/style.css';
import { initApp } from './defaults';


netlifyIdentity.init();
netlifyIdentity.on('login', user => {
  netlifyIdentity.close();
  window.location.replace('/');
});

const App: React.FunctionComponent = () => {
  initApp();
  return (
    <div className="container-fluid">
      <Router>
        <div>
          <nav className="rounded-bottom navbar navbar-light">
            <div className="container d-flex">
              <div className="col-1">
                <a className="navbar-brand" href="/">
                  <img src="/img/logo.png" width="150" height="50" className="d-inline-block align-top" alt=""/>
                </a>
              </div>
              <div className="col-9">
                <span className="navbar-text d-flex justify-content-center">
                  XMT XMF XMS fabrics certification processes gathered together in one place!
                </span>
              </div>
              <div className="col-2 d-flex justify-content-end">
                <ul style={{ listStyleType: "none" }}>
                  <li>
                    <NavLink exact className="nav-link" to="/add">Add cert</NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <Route exact path="/" component={List} />
          <Route exact path="/add" component={Form} />
          <Route exact path="/edit/:id" component={Form} />
        </div>
      </Router>
    </div>
  );
}

!netlifyIdentity.currentUser() ? netlifyIdentity.open('login') : ReactDOM.render(<App />, document.getElementById('root'));



