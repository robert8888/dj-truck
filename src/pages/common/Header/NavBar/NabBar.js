import React, {useEffect} from "react";
import { useAuth0 } from "./../../../../auth0/react-auth0-spa";

const NavBar = (props) => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();


  return (
    <div>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect({})}>Log in</button>
      )}

      {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
    </div>
  );
};

export default NavBar;