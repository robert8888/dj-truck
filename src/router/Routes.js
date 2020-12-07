import React, {Suspense } from "react";
import { Redirect, Route, useLocation} from "react-router-dom";
import Loading from "pages/common/components/Loading/Loding";
import PrivateRoute from "./PrivateRoute";

const Home = React.lazy(()=> import(/* webpackChunkName: "home" */ "pages/home/Home"));
const Introduction = React.lazy(()=> import(/* webpackChunkName: "introduction" */ "pages/introduction/Introduction"));
const Console = React.lazy(() => import(/* webpackChunkName: "console" */ "pages/console/Console"));
const Playlist = React.lazy(() => import(/* webpackChunkName: "playlist" */ "pages/playlist/Playlist"));
const Profile = React.lazy(()=> import(/* webpackChunkName: "profile" */ "pages/profile/Profile"));
const UserRecords = React.lazy(()=> import(/* webpackChunkName: "users_records" */ "pages/userRecords/UserRecords"));
const UserRecord = React.lazy(() => import(/* webpackChunkName: "record" */ "pages/userRecord/UserRecord"));
const Explorer = React.lazy(() => import(/* webpackChunkName: "explorer" */ "pages/explore/Explorer"));
const Genres =  React.lazy(() => import(/* webpackChunkName: "genres" */ "pages/genres/Genres"));

const Routes = props => {
    const location = useLocation();

    React.useEffect(() => {
        const pathBase = location.pathname.split("/")[1];
        document.body.classList = "page--" + pathBase;
    }, [location]);

    return (
        <Suspense fallback={<Loading/>}>
            <>
                <Route path="/" exact component={Home}/>
                <Route path="/introduction/:slug*" component={Introduction}/>
                <Route path="/exploring" exact component={Explorer} />
                <Route path="/genres" exact component={Genres} />
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
                

            </>
        </Suspense>

    )
}

export default Routes;