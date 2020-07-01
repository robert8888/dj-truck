import React, {Suspense } from "react";
import { Redirect, Route } from "react-router-dom";
//import Console from "./../pages/console/Console";
//import Profile from "./../pages/profile/Profile";
//import UserRecords from "./../pages/userRecords/UserRecords";
import Loading from "./../pages/common/components/Loading/Loding";
import PrivateRoute from "./PrivateRoute";

const Home = React.lazy(()=> import(/*webpackChunkName: "home" */ "./../pages/home/Home"));
const Introduction = React.lazy(()=> import(/*webpackChunkName: "introduction" */ "./../pages/introduction/Introduction"));
const Console = React.lazy(() => import(/* webpackChunkName: "console" */ "./../pages/console/Console"));
const Playlist = React.lazy(() => import(/* webpackChunkName: "playlist" */"./../pages/playlist/Playlist"));
const Profile = React.lazy(()=> import(/* webpackChunkName: "profile" */"./../pages/profile/Profile"));
const UserRecords = React.lazy(()=> import(/* webpackChunkName: "users reocrds" */"./../pages/userRecords/UserRecords"));
const UserRecord = React.lazy(() => import(/* webpackChunkName: "record" */"./../pages/userRecord/UserRecord"));
const Explorer = React.lazy(() => import(/* webpackChunkName: "explorer" */"./../pages/explore/Explorer"));


const Routes = props => {
    return (
        <Suspense fallback={<Loading/>}>
            <>
                <Route path="/" exact component={Home}/>
                <Route path="/introduction/:slug*" component={Introduction}/>
                <Route path="/exploring" exact component={Explorer} />
                <PrivateRoute path="/console" exact component={Console} />
                <PrivateRoute path="/my/playlist" exact component={Playlist}/>
                <PrivateRoute path="/my/profile" exact component={Profile} />
                <PrivateRoute path="/my/records" render={ props => <UserRecords {...props} isCurrentUser/>}/>
                
                <Route path="/records" exact component={UserRecords} />
                <Route path="/records/user/:user" exact component={UserRecords} />
                <Route path="/records/genres/:genres" exact component={UserRecords}/>
                <Route path="/records/search/:query" exact 
                    render={ props => (
                            <UserRecords searchQuery={props.match.params.query} {...props}/>
                        )}/>
                <Route exact path="/record/:user" render={ props => 
                        <Redirect to={"/records/"+ props.match.params.user}/>
                    }/>
                <Route path="/record/:user/:title/:id?" exact component={UserRecord} />
                
                <Route path="/test" exact render={() => <h1>Test</h1>} />
            </>
        </Suspense>

    )
}

export default Routes;