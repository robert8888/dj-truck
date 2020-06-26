import React from "react";
import {Container, Row, Col} from "react-bootstrap";
import "./logos.scss";

const Logos = React.memo(() => {

    return (
        <section className="homo-logos">
            <Container>
                <Row>
                    <Col xs={12} lg={12}>
                        <div className="home-logos__wrapper">
                            <img src="/soundcloud.svg" alt="SoundCloud logo" className="home-logos__logo logo-soundcloud"/>
                            <img src="/youtube.svg" alt="YouTube logo" className="home-logos__logo logo-youtube"/>
                        </div>
                    </Col>
                </Row>
            </Container>            
        </section>
    )
})

export default Logos;