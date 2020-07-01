import 'bootstrap/dist/css/bootstrap.min.css';
import "react-on-scroll-animation/build/index.css";
import React from 'react';
import { Provider } from 'react-redux';
import { Auth0Provider } from "./auth0/react-auth0-spa";
import './css/main.scss';
import Router from "./router/Router";
import Routes from "./router/Routes";
import store from "./store";
import history from "./utils/history/history";
import "./utils/viewSize";


const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};


function App() {

  return (
    <Auth0Provider
      domain={domain}
      client_id={clientId}
      redirect_uri={window.location.origin}
      audience={audience}
      onRedirectCallback={onRedirectCallback} >
        <div className="main-container">
          <Provider store={store}>
            <Router>
              <Routes />
            </Router>
          </Provider>
        </div>
    </Auth0Provider>
  );
}

export default App;
