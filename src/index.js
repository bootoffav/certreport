import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
// import jquery from 'jquery/dist/jquery.min.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Form from './Form.js';
import List from './List.js';
import netlifyIdentity from 'netlify-identity-widget';
import './css/style.css';


netlifyIdentity.init();
netlifyIdentity.on('login', user => {
  netlifyIdentity.close();
  window.location.replace('/');
});

function App() {
  const user = netlifyIdentity.currentUser();
  return <div className="container">
          {(!user) ? netlifyIdentity.open('login') : <Navigation />}
         </div>
}

function Navigation() {
  return (
    <div className="col">
      <Router>
          <div>
            <ul className="nav nav-pills nav-fill justify-content-center">
              <li className="nav-item">
                <Link className="nav-link" to="/">List</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/add">Add cert</Link>
              </li>
            </ul>
            <Route exact path="/" component={List} />
            <Route exact path="/add" component={Form} />
            <Route exact path="/edit/:id" component={Form} />
          </div>
      </Router>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
