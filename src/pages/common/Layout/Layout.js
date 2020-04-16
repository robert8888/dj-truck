import React, { Fragment } from "react";
import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";
import { Col, Row, Container } from "react-bootstrap";

const Layout = props => {

    return (
        <Fragment>
            <Header />
            <Container className="app layout container-xl" >
                {props.children}
            </Container>
            <Footer />
        </Fragment>
    )
}

export default Layout;