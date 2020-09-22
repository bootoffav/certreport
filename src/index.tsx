import "tabler-react/dist/Tabler.css";
import 'open-iconic/font/css/open-iconic-bootstrap.min.css';
import 'react-table/react-table.css';
import ReactDOM from 'react-dom';
import React from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import './css/style.css';
import { initApp } from './defaults';
import Main from './components/Main/Main';

initApp();

netlifyIdentity.init();
netlifyIdentity.on('login', () => {
  netlifyIdentity.close();
  ReactDOM.render(<Main />, document.getElementById('root'));
});

netlifyIdentity.currentUser()
    ? ReactDOM.render(<Main />, document.getElementById('root'))
    : netlifyIdentity.open('login');
