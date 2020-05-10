import React from "react";
import { BrowserRouter, Switch } from "react-router-dom"
import Layout from "../pages/common/Layout/Layout";
import LayoutContext from "../pages/common/Layout/LayoutContext";


const Router = props => {

    return (
        <BrowserRouter >
            <LayoutContext.Provider value={{footer: true}}>
                <Layout>
                    <Switch>
                        {props.children}
                    </Switch>
                </Layout>
            </LayoutContext.Provider>
        </BrowserRouter>
    )
}

export default Router;