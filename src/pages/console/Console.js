import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import ExternalSearch from "./../common/components/ExternalSearch/Search";
import PlayListExplorer from "./../common/components/PlayListExplorer/PlayListExplorer";
import DjConsole from "./components/Console/Console";

const Console = props => {
  return (
      <DndProvider backend={Backend}>
          <Container className="app layout container-xl" >
            <DjConsole />
            <Row>
              <Col>
                <ExternalSearch />
                <PlayListExplorer page="console"/>
              </Col>
            </Row>
          </Container>
      </DndProvider>
  )
}


export default Console;