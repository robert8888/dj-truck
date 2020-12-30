import React from "react";
import { connect } from "react-redux";
import Logger from "./../components/Logger/Logger";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import Notifier from "./../../common/components/Notifier/Notifier"
import {LayoutContextProvider} from "./LayoutContext";
import {DndProvider} from "react-dnd";
import {isMobile} from "react-device-detect";
import {TouchBackend} from "react-dnd-touch-backend";
import Backend from "react-dnd-html5-backend";

const Layout = ({ footerType, children }) => {

    return (
        <LayoutContextProvider>
            <Header />
            <Logger />
            <DndProvider backend={isMobile ? TouchBackend :Backend}>
                {children}
                {footerType === "default" && <Footer />}
            </DndProvider>
            <Notifier/>
        </LayoutContextProvider>
    )
}

const mapStateToProps = state => ({
    footerType: state.layout.footer.type,
})

export default connect(mapStateToProps)(Layout);