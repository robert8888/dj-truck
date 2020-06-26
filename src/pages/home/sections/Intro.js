import React from "react";
import "./intro.scss";
import { Container, Row, Col, Button } from "react-bootstrap";
import Rosa from "react-on-scroll-animation";
import { useHistory } from "react-router-dom"

const Intro = () => {
    const history = useHistory();


    return (
        <section className="home-intro">

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <path
                    fill="#fafafa"
                    d="M0 0 q9 17 26 16 22-3 30 6 9 10 28 7 14-3 28 0 9 4 21 5v8H0z"
                />
            </svg>

            <Container>
                <Row>
                    <Col>
                        <Rosa animation="fade-up" once>
                            <h3 className="home-intro__subtitle">
                                Simple - but powerful <span>digital dj software</span>
                            </h3>
                        </Rosa>
                        <Rosa animation="fade-up" delay={200} once>
                            <h2 className="home-intro__title fadeInUp">
                                    Kickstart <span>your Dj career</span>
                            </h2>
                        </Rosa>
                        <Rosa animation="fade-up" delay={400} anchorPlacement="top-bottom" once>
                            <p  className="home-intro__text">
                                    choose your favorite tracks, connect midi controller,
                                    record gig and share to your friends
                            </p>
                        </Rosa>
                        <Button className="home-intro__button"
                                onClick={() => history.replace("/introduction")}>
                                    Get started
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Rosa animation="show-up" anchorPlacement="top-bottom" delay="800" once>
                            <img className="home-intro__laptop"
                                 src="./laptop-preview.png"
                                 alt="program preview in laptop"/>
                        </Rosa>
                    </Col>
                </Row>
            </Container>

        </section>
    )
}

export default Intro 