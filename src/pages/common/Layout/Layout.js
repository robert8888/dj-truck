import React, { Fragment } from "react";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";
import Logger from "./../components/Logger/Logger";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";


const Layout = ({ footerType, children }) => {

    return (
        <Fragment>
            <Header />
            <Logger />
            <Container className="app layout container-xl" >
                {children}
            </Container>
            {footerType === "default" && <Footer />}
        </Fragment>
    )
}

const mapStateToProps = state => ({
    footerType: state.layout.footer.type,
})

export default connect(mapStateToProps)(Layout);