import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
//import { FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "./../../../../../auth0/react-auth0-spa";
import "./nav-bar.scss";

const NavBar = (props) => {
  const { isAuthenticated, loginWithRedirect, logout , user } = useAuth0();


  return (
    <nav className="nav-bar">

      <ul className="main-nav nav-left">
        <li className="main-nav-item nav-left-item nav-item item-logo">
          {/* eslint-disable-next-line */}
          <a ><img alt="Dj truck page logo" src="./../../../../../DJ_TRUCK_LOG_INVERT_MINI.png"></img></a>
          <Link to="/" ><img alt="Dj truck page logo" src="./../../../../../DJ_TRUCK_LOG_INVERT_MINI.png"></img></Link>
        </li>
        <ul className="sub-menu-main">
          <li className="sub-menu-item main-nav-item nav-left-item nav-item nav-item-home">
            <Link to="/" >Home</Link>
          </li>
          <li className="sub-menu-item main-nav-item nav-left-item nav-item">
            <Link to="/exploring" >Explore</Link>
          </li>
          <li className="sub-menu-item main-nav-item nav-left-item nav-item">
            <Link to="/records" >Records</Link>
          </li>
          <li className="sub-menu-item main-nav-item nav-left-item nav-item">
            <Link to="/introduction" >Become a DJ</Link>
          </li>
          { isAuthenticated && <li className="sub-menu-item main-nav-item nav-left-item nav-item">
            <Link to="/console" >Console</Link>
          </li>}
        </ul>
      </ul>


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
              <ul className="sub-menu-user">
                <li className="sub-menu-item">
                    <Link to="/my/records" >My records</Link>
                </li>
                <li className="sub-menu-item">
                    <Link to="/my/playlist">My playlists</Link>
                </li>
                <li className="sub-menu-item">
                    <Link to="/my/profile" >Profile</Link>
                </li>
                <li className="sub-menu-item">
                  {/* eslint-disable-next-line */}
                    <a onClick={() => logout()}>Log out</a>
                </li>
              </ul>
          </li>  
        }
        { !isAuthenticated && 
          <li className="main-nav-item nav-right-item nav-item item-login">
            {/* eslint-disable-next-line */}
              <a onClick={() => loginWithRedirect({})}>Log in</a>
          </li>
        }

      </ul>


    </nav>
  );
};

export default NavBar;