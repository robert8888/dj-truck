import React, { Fragment, useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Logger from "./../components/Logger/Logger";
import Footer from "./../Footer/Footer";
import Header from "./../Header/Header";
import LayoutContext from "./LayoutContext";


const Layout = props => {
    const context = useContext(LayoutContext);
    const [footer, setFooter] = useState(true);
    useEffect(()=>{
        context.setFooter = setFooter;
    }, [context])

    return (
        <Fragment>
            <Header />
            <Logger />
            <Container className="app layout container-xl" >
                {props.children}
            </Container>
            { footer && <Footer />}
        </Fragment>
    )
}

export default Layout;