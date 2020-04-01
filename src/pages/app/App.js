import React from "react";
import Header from "./../common/Header/Header";
import Footer from "./../common/Footer/Footer";
import { Col, Row, Container } from "react-bootstrap";
import {DndProvider} from "react-dnd";
import Backend from "react-dnd-html5-backend";
import Search from "./components/Search/Search";
import PlayListExplorer from "./components/PlayListExplorer/PlayListExplorer";
import Console from "./components/Console/Console"
const App = props => {

  return (
      <Container className="app layout container-xl" >
        <Header/>
        <DndProvider backend={Backend}>
          <Console />
          <Row>
            <Col>
              <Search/>
              <PlayListExplorer/>
            </Col>
          </Row>
        </DndProvider>
        <Footer/>
      </Container>
  )
}


export default App;