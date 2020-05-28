import React, { useCallback } from "react";
import { Route } from "react-router-dom";
import { useAuth0 } from "./../auth0/react-auth0-spa";

const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();


  const redirect = useCallback(async () => {
    if (loading) {
      return;
    }

    await loginWithRedirect({
      appState: { targetUrl: window.location.pathname }
    });
  }, [loading, loginWithRedirect])

  const render = props => {
    if (isAuthenticated) {
      return <Component {...props} />
    } else {
      redirect();
    }
  }

  return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;