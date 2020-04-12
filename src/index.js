
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from "./auth0/react-auth0-spa";
import history from "./utils/history/history";
import "default-passive-events";


//....

const domain = process.env.REACT_APP_AUTH0_DOMAIN ;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

console.log(domain)
console.log(clientId)
console.log( audience);

const onRedirectCallback = appState => {
    history.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  };
  
  ReactDOM.render(
    <Auth0Provider
      domain={domain}
      client_id={clientId}
      redirect_uri={window.location.origin}
      audience={audience} 
      onRedirectCallback={onRedirectCallback}
    >
      <App />
    </Auth0Provider>,
    document.getElementById("root")
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
