import React from "react";
import { connect } from "react-redux";
import Console from "./../../../../core/console/console";
import ZoomControls from "./ZoomControls/ZoomControls";
import Loading from "./Loading/Loading";
import {setZoom} from "../../../../../../actions";
import classNames from "classnames";
import "./player.scss";

class Player extends React.Component {
  constructor() {
    super();
    this.masterContainer = React.createRef();
    this.slaveContainer = React.createRef();
  }

  componentDidMount() {
    Console.Get().then( console => {
      console.createChannel(
          this.props.name,
          this.masterContainer.current,
          this.slaveContainer.current
      )
    });
  }

  handleZoom(direction){
    this.props.zoom(direction)
  }

  render() {
    const overlayClasses = classNames("player__warning-overlay",
            {"player__warning-overlay--hidden": !this.props.timeWarning}
        )

    return (
      <div className={"player player-" + this.props.name}>
        <Loading name={this.props.name}/>
        <ZoomControls
            zoomIn={this.handleZoom.bind(this, "decrement")}
            zoomOut={this.handleZoom.bind(this, "increment")}
            className={"scale-controls--" + this.props.name}/>
        <div className={"player__wrapper"}>
          <div className="player__master" ref={this.masterContainer} />
          <div className={overlayClasses}/>
        </div>
        <div className={"player__wrapper"}>
          <div className="player__slave" ref={this.slaveContainer} />
          <div className={overlayClasses}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
    timeWarning: state.console.channel[ownProps.name].playBackState.timeWarning &&
        !state.console.channel[ownProps.name].playBackState.paused
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  zoom: (direction) => dispatch(setZoom(ownProps.name, direction))
})

export default connect(mapStateToProps, mapDispatchToProps)(Player);
