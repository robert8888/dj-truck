import createAuth0Client from "@auth0/auth0-spa-js";
import React, { useContext, useEffect, useState } from "react";
import { removeUser, setUserProfile } from "./../actions";
import store from "./../store";
import {Logger, Log} from "./../utils/logger/logger";


const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);

let clientExternalResolver;
export let auth0ClientExternal = new Promise((res, rej) => {
  clientExternalResolver = res;
})

export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const dispatch = store.dispatch;

  useEffect(() => {
    const initAuth0 = async () => {
      try {
        const auth0FromHook = await createAuth0Client(initOptions);
        setAuth0(auth0FromHook);
      } catch(err){
        Logger.push(Log.Warning(`You are on not secure domain. !!! 
                                  for this reason you can't login. 
                                  Pls go to : https://....`)
                    );
        setLoading(false);
      }

    };
    initAuth0();
    // eslint-disable-next-line
  }, [setLoading]);

  useEffect(() => {
    if (!auth0Client) return;

    const setupAuth0 = async () => {
      clientExternalResolver(auth0Client);

      if (window.location.search.includes("code=") &&
        window.location.search.includes("state=")) {
        const { appState } = await auth0Client.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await auth0Client.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0Client.getUser();
        setUser(user);

        dispatch(setUserProfile({
          logged: true,
          ...user,
        }))
      }
      setLoading(false);
    }

    setupAuth0();
  }, [auth0Client, dispatch, onRedirectCallback])


  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client.getUser();
    setUser(user);
    setIsAuthenticated(true);

    dispatch(setUserProfile({
      logged: true,
      ...user,
    }))
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);

    dispatch(setUserProfile({
      logged: true,
      ...user,
    }))
  };

  const logout = (...p) => {
    auth0Client.logout(...p);
    dispatch(removeUser())
  }

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...p) => auth0Client && auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => auth0Client && auth0Client.loginWithRedirect(...p),
        getTokenSilently: (...p) => auth0Client && auth0Client.getTokenSilently(...p),
        getTokenWithPopup: (...p) => auth0Client && auth0Client.getTokenWithPopup(...p),
        logout: (...p) => logout(...p)
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};

