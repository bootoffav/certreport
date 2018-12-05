import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
// import jquery from 'jquery/dist/jquery.min.js';
import React from 'react';
import ReactDOM from 'react-dom';
import netlifyIdentity from 'netlify-identity-widget';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './css/style.css';


window.netlifyIdentity = netlifyIdentity;
netlifyIdentity.init();
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
