import React from "react";
import { BrowserRouter, Switch } from "react-router-dom"
import history from "./../utils/history/history";
import Layout from "../pages/common/Layout/Layout";

const Router = props => {

    return (
        <BrowserRouter history={history}>
            <Layout>
                <Switch>
                    {props.children}
                </Switch>
            </Layout>
        </BrowserRouter>
    )
}

export default Router;