import React from "react";
import Console from "./components/Console/Console";
import { Col, Row, Container } from "react-bootstrap";
import Search from "./components/Search/Search";
import PlayList from "./components/PlayList/PlayList";

const App = props => {

  return (
    <Container className="app layout container-xl" >
      <Console />
      <Row>
        <Col>
          <Search />
          <PlayList />
        </Col>
      </Row>
    </Container>
  )
}


export default App;