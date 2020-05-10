import React from 'react';
import { Provider } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/main.scss';

import store from "./store";


import Router from "./Router/Router";
import Routes from "./Router/Routes";


function App() {

  return (
      <div className="main-container">
          <Provider store={store}>
              <Router>
                <Routes/>
              </Router>
         </Provider>
      </div>
  );
}

export default App;
