import React from "react";
import "./intro.scss";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom"

const Intro = () => {
    const history = useHistory();

    return (
        <section className="home-intro">


            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <path
                    fill="#fafafa"
                    d="M0 0 q9 17 26 16 22-3 30 6 9 10 28 7 14-3 28 0 9 4 21 5v8H0z"
                ></path>
            </svg>

            <Container>
                <Row>
                    <Col>
                        <h3 className="header-sub-title " 
                            data-aos="custom-feed-in-up" 
                            data-aos-delay="0">
                                Simple - but powerful <span>digital dj software</span>
                        </h3>
                        <h2 className="header-title fadeInUp" 
                            data-aos="custom-feed-in-up" 
                            data-aos-delay="100">
                                Kickstart <span>your Dj career</span>
                        </h2>
                        <p  className="intro-text fadeInUp" 
                            data-aos="custom-feed-in-up" 
                            data-aos-delay="200"> 
                                choose your favorite tracks, connect midi controller, 
                                record gig and share to your friends
                        </p>
                        <Button onClick={() => history.replace("/introduction")} 
                                data-aos="custom-feed-in-up" 
                                data-aos-delay="300" 
                                data-aos-offset="-100">
                                    Get started
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <img src="./laptop-preview.png" alt="program preview in laptop"></img>
                    </Col>
                </Row>
            </Container>

        </section>
    )
}

export default Intro 