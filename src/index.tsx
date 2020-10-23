import 'tabler-react/dist/Tabler.css';
import 'react-table/react-table.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import './css/style.css';
import 'bootstrap';
import ReactDOM from 'react-dom';
import netlifyIdentity from 'netlify-identity-widget';
import { initApp } from './defaults';
import { Main } from './components/Main/Main';

initApp();

netlifyIdentity.init();
netlifyIdentity.on('login', () => {
  netlifyIdentity.close();
  ReactDOM.render(<Main />, document.getElementById('root'));
});

netlifyIdentity.currentUser()
  ? ReactDOM.render(<Main />, document.getElementById('root'))
  : netlifyIdentity.open('login');
