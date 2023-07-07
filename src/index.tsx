import 'tabler-react/dist/Tabler.css';
import 'react-table/react-table.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import './css/style.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap';
import netlifyIdentity from 'netlify-identity-widget';
import { initApp } from './defaults';
import { Provider } from 'react-redux';
import store from './store/store';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from 'components/App/App';

initApp();

netlifyIdentity.init();
netlifyIdentity.on('login', () => {
  netlifyIdentity.close();
  run();
});

netlifyIdentity.currentUser() ? run() : netlifyIdentity.open('login');

function run() {
  createRoot(document.getElementById('app')!).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
}
