import React from "react";
import { connect } from "react-redux";
import Console from "./../../../../core/console/console";
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

  render() {

    return (
      <div className={"player player-" + this.props.name}>
        {this.props.loadingProgress < 100 && this.props.loadingProgress > 0 && (
          <div className="player-loading">
            <span>Loading {this.props.loadingProgress} % </span>
          </div>
        )}
        <div className="master" ref={this.masterContainer} />
        <div className="slave" ref={this.slaveContainer} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  loadingProgress : state.console.channel[ownProps.name].playBackState.loadingProgress,
});


export default connect(mapStateToProps)(Player);
