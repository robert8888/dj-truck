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
              <Row className="console">
                <Col className="deck-a" lg="5" xs="5" xl="5"  md="12" sm="12" >
                  <Deck active name="A">A</Deck>
                </Col>
                <Col className="mikser"  lg="2" xs="2" xl="2"  md="12" sm="12"  style={{background:'white'}}>
                   <Mixer />
                </Col>
                <Col className="deck-b" lg="5" xs="5" xl="5"  md="12" sm="12"  >
                  <Deck name="B">B</Deck>
                </Col>
              </Row>
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
