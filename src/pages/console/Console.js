import React, {useEffect, useMemo} from "react";
import {Col, Container, Row} from "react-bootstrap";
import ExternalSearch from "./../common/components/ExternalSearch/Search";
import PlayListExplorer from "pages/common/components/PlayListExplorer/PlayListExplorer";
import Console from "./components/Console/Console";
import TourGuide from "./components/Console/TourGuide/TourGuide";
import {useSelector} from "react-redux";
import useLocationSearchParams from "pages/common/Hooks/useLocationSearchParams";
import useDynamicFooter from "../common/Hooks/useDynamicFooter";
import "./console.scss"

const PageConsole = () => {
  const page = useMemo(()=> "console", [])
  const {tutorial} = useLocationSearchParams()
  const userId = useSelector(state => state.user.id);
  const [setFooter] = useDynamicFooter();

  useEffect(()=>{setFooter("default")}, [setFooter])

  const isOpenTourGuideActive = useMemo(()=>{
      if(tutorial === "false") return false;
      if(/*process.env.NODE_ENV === "development" ||*/ tutorial === "true") return true;
      if(window.localStorage.getItem("tour-guide-flag-id--" + userId)) return false;

      window.localStorage.setItem("tour-guide-flag-id--" + userId, true)
      return true;
  }, [tutorial, userId])


  return (
    <>
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
    </>
  )
}


export default PageConsole;