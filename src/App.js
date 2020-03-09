import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.scss';



import store from "./store";
import Console from "./core/console/console";

//components 
import Search from "./components/Search/Search";
import Deck from "./components/Deck/Deck";
import PlayList from "./components/PlayList/PlayList";
import Mixer from "./components/Mixer/Mixer";

import { Container, Row, Col } from 'react-bootstrap';

function App() {

  useEffect(()=>{
    Console.Create();
  },[])

  return (
      <div className="app">
          <Provider store={store}>
            <Container className="layout container-xl" >
              <div class="dj-truck-console">
                <Deck name="A">A</Deck>
                <Mixer />
                <Deck name="B">B</Deck>
              </div>
              <Row>
                <Col>
                  <Search/>
                  <PlayList/>
                </Col>
              </Row>
            </Container>
         </Provider>
      </div>

  );
}

export default App;
