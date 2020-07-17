import React, {useMemo} from "react";
import {Col, Container, Row} from "react-bootstrap";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import ExternalSearch from "./../common/components/ExternalSearch/Search";
import PlayListExplorer from "./../common/components/PlayListExplorer/PlayListExplorer";
import Console from "./components/Console/Console";
import "./console.scss"

const PageConsole = () => {
  const page = useMemo(()=> "console", [])
  return (
      <DndProvider backend={Backend}>
          <Container className="app layout container-xl" >
            <Console />
            <Row className={"component__playlist-navigation"}>
              <Col>
                <ExternalSearch page={page}/>
                <PlayListExplorer page={page}/>
              </Col>
            </Row>
          </Container>
      </DndProvider>
  )
}


export default PageConsole;