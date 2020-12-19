import React from "react";
import { connect } from "react-redux";
import Logger from "./../components/Logger/Logger";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import Notifier from "./../../common/components/Notifier/Notifier"
import {LayoutContextProvider} from "./LayoutContext";

const Layout = ({ footerType, children }) => {

    return (
        <LayoutContextProvider>
            <Header />
            <Logger />
                {children}
                {footerType === "default" && <Footer />}
            <Notifier/>
        </LayoutContextProvider>
    )
}

const mapStateToProps = state => ({
    footerType: state.layout.footer.type,
})

export default connect(mapStateToProps)(Layout);