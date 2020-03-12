import React, { useEffect, useState } from "react";
import Console from "./../../../../core/console/console";
import "./sync-bar.scss";

class SyncBar extends React.Component {
  constructor() {
    super(...arguments);
    this.channelInterface = Console.Get().getChannelInterface(this.props.name);
  }

  state = {
    position: 0
  };

  update() {
   // console.log("update", this.props.name);
    this.setState({
      ...this.state,
      position: this.channelInterface.getSyncBarPosition()
    });

    if (!this.props.active) {
      console.log("stop interval");
      clearInterval(this.intervalHandler);
      this.intervalHandler = null;
    }
  }

  render() {
    const style = {};
    style.display = "none";

 //   console.log(this.state.position)
    if (this.props.active) {
      style.display = "block";
      style.width = Math.abs(this.state.position * 100) + "%"; //max 50 %;
      if (this.state.position > 0) {
        style.left = "50%";
      } else {
        style.left = "auto";
        style.right = "50%";
      }

      if (!this.intervalHandler) {
        this.intervalHandler = setInterval(this.update.bind(this), 100);
      }
    }

    return (
      <div className={this.props.className + " sync-bar-deck-" + this.props.name}>
        <div className="bar-area">
          <div className="bar-thumb" style={style} />
        </div>
      </div>
    );
  }
}

export default SyncBar;
