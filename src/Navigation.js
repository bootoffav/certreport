import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect,
    withRouter } from "react-router-dom";
import Form from './Form.js';
import List from './List.js';
import netlifyIdentity from 'netlify-identity-widget';


class Navigation extends React.Component {
    render (){
        return (
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
        )
    }
}

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

const netlifyAuth = {
    isAuthenticated: false,
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
            <p>You must log in to view the page at {from.pathname}</p>
            <button onClick={this.login}>Log in</button>
        </div>
        );
    }
}

export default Navigation;