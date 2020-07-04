import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "./../../../../../auth0/react-auth0-spa";
import "./nav.scss";

const NavBar = (props) => {
  const { isAuthenticated, loginWithRedirect, logout , user } = useAuth0();


  return (
    <nav className="nav">
      <ul className="nav--main nav--left">
        <li className="nav__item--main nav__item--left nav__item nav__item__logo">
          {/* eslint-disable-next-line */}
          <a >
            <img alt="Dj truck page logo" src="./../../../../../DJ_TRUCK_LOG_INVERT_MINI.png"/>
          </a>
          <Link to="/" >
            <img alt="Dj truck page logo" src="./../../../../../DJ_TRUCK_LOG_INVERT_MINI.png"/>
          </Link>
        </li>
        <ul className="nav-sub--main">
          <li className="nav-sub__item  nav__item--main nav__item--left  nav__item nav__item__home">
            <Link to="/" >Home</Link>
          </li>
          <li className="nav-sub__item nav__item--main  nav__item--left  nav__item">
            <Link to="/exploring" >Explore</Link>
          </li>
          <li className="nav-sub__item nav__item--main nav__item--left  nav__item">
            <Link to="/introduction" >Become a DJ</Link>
          </li>
          { isAuthenticated &&
            <li className="nav-sub__item nav__item--main nav__item--left  nav__item">
              <Link to="/console" >Console</Link>
            </li>
          }
        </ul>
      </ul>


      <ul className="nav--main nav--right">

        { isAuthenticated && user && 
          <li className="nav__item--main nav__item--right nav__item nav__item__user">
              <img src={user.picture} alt="Profile" />
              <h4>{user.nickname}</h4>
          </li> }

        { isAuthenticated &&
          <li className="nav__item--main nav__item--right nav__item nav__item__sub-menu">
              <div className="nav__item__icon">
                <FontAwesomeIcon className="icon" icon={faEllipsisH} size="2x"/>
              </div>
              <ul className="nav-sub--user">
                <li className="nav-sub__item">
                    <Link to="/my/records" >My records</Link>
                </li>
                <li className="nav-sub__item">
                    <Link to="/my/playlist">My playlists</Link>
                </li>
                <li className="nav-sub__item">
                    <Link to="/my/profile" >Profile</Link>
                </li>
                <li className="nav-sub__item">
                  {/* eslint-disable-next-line */}
                    <a onClick={() => logout()}>Log out</a>
                </li>
              </ul>
          </li>  
        }
        { !isAuthenticated && 
          <li className="nav__item--main  nav__item--right nav__item nav__item__login">
            {/* eslint-disable-next-line */}
              <a onClick={() => loginWithRedirect({})}>Log in</a>
          </li>
        }

      </ul>


    </nav>
  );
};

export default NavBar;