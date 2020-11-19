import React from "react";
import { connect } from "react-redux";
import Console from "./../../../../core/console/console";
import "./player.scss";
import ZoomControls from "./ZoomControls/ZoomControls";
import {setZoom} from "../../../../../../actions";
import Loading from "./Loading/Loading";

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
    return (
      <div className={"player player-" + this.props.name}>
        <Loading name={this.props.name}/>
        <ZoomControls
            zoomIn={this.handleZoom.bind(this, "decrement")}
            zoomOut={this.handleZoom.bind(this, "increment")}
            className={"scale-controls--" + this.props.name}/>
        <div className="player__master" ref={this.masterContainer} />
        <div className="player__slave" ref={this.slaveContainer} />
      </div>
    );
  }
}


const mapDispatchToProps = (dispatch, ownProps) => ({
  zoom: (direction) => dispatch(setZoom(ownProps.name, direction))
})

export default connect(null, mapDispatchToProps)(Player);
