import React from "react";
import { BrowserRouter, Switch } from "react-router-dom"
import Layout from "../pages/common/Layout/Layout";


const Router = props => {

    return (
        <BrowserRouter >
                <Layout>
                    <Switch>
                        {props.children}
                    </Switch>
                </Layout>
        </BrowserRouter>
    )
}

export default Router;