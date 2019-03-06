import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'open-iconic/font/css/open-iconic-bootstrap.min.css';
import 'react-table/react-table.css';
import React from 'react';
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


function App() {
  if (!netlifyIdentity.currentUser()) {
    return <div>{ netlifyIdentity.open('login') }</div>;
  }

  initApp();
  return (
    <div className="container">
      <Router>
        <div>
          <nav class="navbar navbar-light" style={{ backgroundColor: "rgba(166, 188, 212, 0.5)" }}>
            <div className="container d-flex flex-row-reverse">
              <ul style={{ listStyleType: "none" }}>
                <li className="nav-item">
                  <NavLink exact className="nav-link" to="/add">Add cert</NavLink>
                </li>
              </ul>
              <span class="navbar-text">
                XMTextiles fabrics certification processes gathered together in one place!
              </span>
              <a class="navbar-brand" href="/">
                <img src="/img/logo.png" width="150" height="50" class="d-inline-block align-top" alt=""/>
              </a>
            </div>
          </nav>
          <Route exact path="/" component={List} />
          <Route exact path="/add" component={Form} />
          <Route exact path="/edit/:id" component={Form} />
        </div>
      </Router>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));