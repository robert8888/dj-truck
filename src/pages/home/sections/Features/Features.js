import React from "react";
import "./features.scss";
import {Container, Row, Col} from "react-bootstrap";
import Feature from "./Feature";
import {faFileAudio, faListAlt, faSlidersH} from "@fortawesome/free-solid-svg-icons"

const Featrues = ()=>{
    return (
        <section className="home-feautres">
            <Container>
                <Row className="row-section-header">
                    <Col>
                        <div className="line"/>
                        <h3 className="section-title">Broswer and willingness <span> - that's all what you need</span></h3>
                    </Col>
                </Row>
                <Row>
                    <Feature 
                        icon={faListAlt}
                        header={"Playlist"} 
                        text={`Build your playlist using external music source. 
                        Categorize it in directories, and set track order as you like. You can create as many lists as you want`}
                        link={"/introduction#external"}
                        animationDelay={"100"}
                        />
                    <Feature 
                        icon={faSlidersH}
                        header={"Dj Console"} 
                        text={`Push track from your playlist to console players. Press play, adjust tempo or use sync.
                        You have mixer with effects and filters. It's simple just be creative. `}
                        link={"/introduction#external"}
                        animationDelay={"300"}
                        />
                    <Feature 
                        icon={faFileAudio}
                        header={"Records"} 
                        text={`You can record your set. Just press record button. 
                        All your record are stored on your account. You can set description and record genres. `}
                        link={"/introduction#external"}
                        animationDelay={"500"}
                        />
                </Row>
            </Container>
        </section>

    )
}

export default Featrues