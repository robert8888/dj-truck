import React, {useMemo} from "react";
import {Col, Container, Row} from "react-bootstrap";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import ExternalSearch from "./../common/components/ExternalSearch/Search";
import PlayListExplorer from "./../common/components/PlayListExplorer/PlayListExplorer";
import Console from "./components/Console/Console";
import TourGuide from "./components/Console/TourGuide/TourGuide";
import "./console.scss"
import {useSelector} from "react-redux";
import useLocationSearchParams from "../common/Hooks/useLocationSearchParams";

const PageConsole = () => {
  const page = useMemo(()=> "console", [])
  const {tutorial} = useLocationSearchParams()
  const userId = useSelector(state => state.user.id);

  const isOpenTourGuideActive = useMemo(()=>{
      if(tutorial === "false") return false;
      if(process.env.NODE_ENV === "development" || tutorial) return true;
      if(window.localStorage.getItem("tour-guide-flag-id--" + userId)) return false;

      window.localStorage.setItem("tour-guide-flag-id--" + userId, true)
      return true;
  }, [tutorial])

  return (
      <DndProvider backend={Backend}>
          <TourGuide isOpen={isOpenTourGuideActive}/>
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