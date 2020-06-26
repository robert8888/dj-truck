import React from "react";
import "./footer.scss"
import {Col, Container, Row} from "react-bootstrap";

const Footer = props => {

    return (
        <div className="footer">
            <Container>
                <Row>
                    <Col xs={12} className={"col"}>
                        <div className={"footer-content"}>
                            <p className={"copyright"}>© Copyright registered Dj Truck Studio | <a href="/">Privacy Policy</a></p>
                            <a href={"mailto:admin@djtruck.pl"}>@Support</a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Footer;