import React from "react";
import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";
import { Col, Row, Container } from "react-bootstrap";

const Layout = props => {

    return (
        <Container className="app layout container-xl" >
            <Row>
                <Col>
                    <Header />
                </Col>
            </Row>

            {props.children}

            <Row>
                <Col>
                    <Footer />
                </Col>
            </Row>
        </Container>
    )
}

export default Layout;