import React from "react";
import { Col, Row } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import Search from "./../common/components/Search/Search";
import PlayListExplorer from "./../common/components/PlayListExplorer/PlayListExplorer";
import DjConsole from "./components/Console/Console"

const Console = props => {
  return (
      <DndProvider backend={Backend}>
        <DjConsole />
        <Row>
          <Col>
            <Search />
            <PlayListExplorer console/>
          </Col>
        </Row>
      </DndProvider>
  )
}


export default Console;