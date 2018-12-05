import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
// import jquery from 'jquery/dist/jquery.min.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Redirect,
    withRouter } from "react-router-dom";
import Form from './Form.js';
import List from './List.js';
import netlifyIdentity from 'netlify-identity-widget';
import './css/style.css';


window.netlifyIdentity = netlifyIdentity;
netlifyIdentity.init();


const App = () => (
    <div className="container">
        <div className="row">
            <Router>
                <div>
                    <AuthButton />
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <Link className="navbar-brand" to="/">Cert Report</Link>
                    <Link to="/add">Add cert</Link>
                </nav>
                    <Route path="/login" component={Login} />
                    <PrivateRoute exact path="/" component={List} />
                    <PrivateRoute exact path="/add" component={Form} />
                    <PrivateRoute exact path="/edit/:id" component={Form} />
                </div>
            </Router>
        </div>
    </div>
)
  
  const netlifyAuth = {
    isAuthenticated: true,
    user: null,
    authenticate(callback) {
      this.isAuthenticated = true;
      netlifyIdentity.open();
      netlifyIdentity.on('login', user => {
        this.user = user;
        callback(user);
      });
    },
    signout(callback) {
      this.isAuthenticated = false;
      netlifyIdentity.logout();
      netlifyIdentity.on('logout', () => {
        this.user = null;
        callback();
      });
    }
  };
  
  const AuthButton = withRouter(
    ({ history }) =>
      netlifyAuth.isAuthenticated ? (
        <p>
          Welcome!{' '}
          <button
            onClick={() => {
              netlifyAuth.signout(() => history.push('/'));
            }}
          >
            Sign out
          </button>
        </p>
      ) : (
        <p>You are not logged in.</p>
      )
  );
  
  function PrivateRoute({ component: Component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          netlifyAuth.isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }
  
  class Login extends React.Component {
    state = { redirectToReferrer: false };
  
    login = () => {
      netlifyAuth.authenticate(() => {
        this.setState({ redirectToReferrer: true });
      });
    };
  
    render() {
      let { from } = this.props.location.state || { from: { pathname: '/' } };
      let { redirectToReferrer } = this.state;
  
      if (redirectToReferrer) return <Redirect to={from} />;
  
      return (
        <div>
          {/* <p>You must log in to view the page at {from.pathname}</p> */}
          <button onClick={this.login}>Log in</button>
        </div>
      );
    }
  }


ReactDOM.render(<App />, document.getElementById('root'));
