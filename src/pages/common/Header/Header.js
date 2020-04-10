import React from "react";
import LoadingBar from 'react-redux-loading-bar';
import NavBar from "./NavBar/NabBar"
import "./header.scss";

export default class Header extends React.Component {
  render() {
    return (
      <header>
        <LoadingBar  className="loading-bar" />
        <NavBar className="navigation-bar"/>
      </header>
    )
  }
}