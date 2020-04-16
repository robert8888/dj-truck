import React, { useEffect } from "react";
import { useAuth0 } from "./../../../../auth0/react-auth0-spa";
import { Link } from "react-router-dom";
//import { FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import "./nav-bar.scss"

const NavBar = (props) => {
  const { isAuthenticated, loginWithRedirect, logout , user } = useAuth0();


  return (
    <nav className="nav-bar">

      <ul className="main-nav nav-left">
        <li className="main-nav-item nav-left-item nav-item item-logo">
          <Link to="/" ><img src="./../../../../../DJ_TRUCK_LOG_INVERT_MINI.png"></img></Link>
        </li>
        <li className="main-nav-item nav-left-item nav-item">
          <Link to="/" >Home</Link>
        </li>
        <li className="main-nav-item nav-left-item nav-item">
          <Link to="/console" >Records</Link>
        </li>
        <li className="main-nav-item nav-left-item nav-item">
          <Link to="/miusic" >Playlist</Link>
        </li>
        <li className="main-nav-item nav-left-item nav-item">
          <Link to="/miusic" >Console</Link>
        </li>

      </ul>

      {/* <ul className="main-nav nav-center">
        <li className="main-nav-item nav-center-item nav-item">
            <FormControl 
              className="search-input" 
              placeholder="Search miusic"
              type="text" />


        </li>
      </ul> */}

      <ul className="main-nav nav-right">

        { isAuthenticated && user && 
          <li className="main-nav-item nav-right-item nav-item item-user">
              <img src={user.picture} alt="Profile" />
              <h4>{user.nickname}</h4>
          </li> }

        { isAuthenticated &&
          <li className="main-nav-item nav-right-item nav-item item-user-menu">
              <div className="icon-container">
                <FontAwesomeIcon className="icon" icon={faEllipsisH} size="2x"/>
              </div>
              <ul className="sub-menu">
                <li className="sub-menu-item">
                    <Link to="/profil" >My records</Link>
                </li>
                <li className="sub-menu-item">
                    <Link to="/playlist">My playlists</Link>
                </li>
                <li className="sub-menu-item">
                    <Link to="/profil" >Profil</Link>
                </li>
                <li className="sub-menu-item">
                    <a onClick={() => logout()}>Log out</a>
                </li>
              </ul>
          </li>  
        }
        { !isAuthenticated && 
          <li className="main-nav-item nav-right-item nav-item item-login">
              <a onClick={() => loginWithRedirect({})}>Log in</a>
          </li>
        }
        {/* <li className="main-nav-item nav-right-item nav-item">
          {!isAuthenticated && (
            <button onClick={() => loginWithRedirect({})}>Log in</button>
          )}

           {isAuthenticated && <button onClick={() => logout()}>Log out</button>} 
        </li> */}
      </ul>


    </nav>
  );
};

export default NavBar;