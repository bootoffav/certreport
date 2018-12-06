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
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <Link className="navbar-brand" to="/">Cert Report</Link>
              <Link to="/add">Add cert</Link>
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
