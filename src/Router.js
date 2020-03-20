import React from 'react';
import { Provider } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/main.scss';



import store from "./store";


import App from "./pages/app/App"


function Router() {



  return (
      <div className="dj-truck">
          <Provider store={store}>
              <App/>
         </Provider>
      </div>

  );
}

export default Router;
