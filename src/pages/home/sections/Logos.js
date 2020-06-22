import React from "react";
import {Container, Row, Col} from "react-bootstrap";
import "./logos.scss";

const Logos = React.memo(() => {

    return (
        <section className="homo-logos">
            <Container>
                <Row>
                    <Col xs={12} lg={12}>
                        <div className="logos-container">
                            <img src="/soundcloud.svg" alt="SoundCloud logo" className="logo-brand soundcloud-logo"/>
                            <img src="/youtube.svg" alt="YouTube logo" className="logo-brand youtube-logo"/>
                        </div>
                    </Col>
                </Row>
            </Container>            
        </section>
    )
})

export default Logos;