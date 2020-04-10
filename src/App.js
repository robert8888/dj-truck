import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/main.scss';



import store from "./store";
import {getCurrentUser} from "./actions";

import Router from "./Router/Router";
import Routes from "./Router/Routes";


function App(props) {


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
