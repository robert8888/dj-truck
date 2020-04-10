import React , { Fragment } from "react";
import { Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import Console from "./../pages/console/Console";
import Profile from "./../pages/profile/Profile";

const Routes = props =>{
    return (
        <Fragment>
            <Route path="/" exact component={Console}/>
            <PrivateRoute path="/profile" exact component={Profile}/>
            <Route path="/test" exact render={()=><h1>Test</h1>} />
        </Fragment>
    )
}

export default Routes;