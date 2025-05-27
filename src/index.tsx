import 'tabler-react/dist/Tabler.css';
import 'react-table/react-table.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import './css/style.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap';
import { initApp } from './defaults';
import { Provider } from 'react-redux';
import store from './store/store';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App/App';
import { Auth0Provider } from '@auth0/auth0-react';
import { useAuth0 } from '@auth0/auth0-react';

initApp();

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN ?? ''}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID ?? ''}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <Provider store={store}>
        <WrapWithAuth />
      </Provider>
    </Auth0Provider>
  </StrictMode>
);

function WrapWithAuth() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  if (isLoading) {
    return (
      <div className="centered is-flex is-justify-content-center">
        HOLD ON A SECOND...
      </div>
    );
  }

  return isAuthenticated ? <App /> : <>{loginWithRedirect()}</>;
}
