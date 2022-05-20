import 'tabler-react/dist/Tabler.css';
import 'react-table/react-table.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import './css/style.css';
import 'bootstrap';

import ReactDOM from 'react-dom';
import netlifyIdentity from 'netlify-identity-widget';
import { initApp } from './defaults';
import { Main } from './components/Main/Main';
import { Provider } from 'react-redux';
import { store } from './store';
import React from 'react';

initApp();

netlifyIdentity.init();
netlifyIdentity.on('login', () => {
  netlifyIdentity.close();
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <Main />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );
});

netlifyIdentity.currentUser()
  ? ReactDOM.render(
      <React.StrictMode>
        <Provider store={store}>
          <Main />
        </Provider>
      </React.StrictMode>,
      document.getElementById('root')
    )
  : netlifyIdentity.open('login');
