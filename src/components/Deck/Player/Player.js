import React from "react";
import { connect } from "react-redux";
import WaveSurfer from "wavesurfer";
import Console from "./../../../core/console/console";
import { setChannelReady, setTimeLeft } from "./../../../actions";
import { getBeatLength } from "./../../../utils/bpm/converter";
import config from "./configuration";
import "./player.scss";

class Player extends React.Component {
  constructor() {
    super();
    this.masterContainer = React.createRef();
    this.slaveContainer = React.createRef();

    this.state = {
      loadingProgress: 0
    };
  }

  setLoading(progress) {
    this.setState(state => {
      let _state = { ...state };
      _state.loadingProgress = progress;
      return _state;
    });
  }

  drawBeatBars(bpm, offset) {
    let wrapper = this.master.drawer.wrapper;
    let styleApply = WaveSurfer.Drawer.style;
    let minPxPerSec = config.master().minPxPerSec;
    let bitLength = getBeatLength(bpm);

    let barPostions = [];

    for (let i = offset; i < this.master.getDuration(); i += bitLength) {
      barPostions.push(i);
    }

    let barStyle = position => ({
      position: "absolute",
      left: position + "px",
      top: "0px",
      width: "1px",
      maxWidth: "1px",
      height: "100%",
      background: "rgba(255,255,255, 0.5)"
    });

    this.barsElements = [];
    barPostions.forEach(position => {
      let bar = document.createElement("div");
      let style = barStyle(minPxPerSec * position);
      styleApply(bar, style);
      wrapper.appendChild(bar);
      this.barsElements.push(bar);
    });
  }

  clearState() {
    this.slave.load(null, []);
    if (this.barsElements) {
      this.barsElements.forEach(htmlElement => htmlElement.remove());
    }
  }

  componentDidMount() {
    this.master = WaveSurfer.create(
      config.master(this.masterContainer.current, this.props.name)
    );
    this.master.__proto__.loadWithEvent = function(...args) {
      this.fireEvent("load");
      this.load(...args);
    };

    
    this.slave = WaveSurfer.create(
      config.slave(this.slaveContainer.current, this.props.name)
    );


    const mixConsole = Console.Get();
    mixConsole.setPlayer(this.props.name, this.master);

    this.master.on("load", () => {
      this.clearState();
    });

    this.master.on("loading", progress => {
      this.setLoading(progress);
    });

    this.master.on("ready", () => {
      this.currentDuration = this.master.getDuration();
      let resolution = 430;
      this.slave.load(
        null,
        this.master.backend.getPeaks(resolution, 0, resolution)
      );
      this.setLoading(100);
      this.props.setReadyHandler(true);
      startSync();
    });

    this.slave.on("seek", progress => {
      const wasPlaying = this.master.isPlaying();

      this.master.backend.seekTo(progress * this.currentDuration);
      this.master.drawer.progress(progress);
      this.master.fireEvent("seek", progress);

      this.slave.drawer.progress(progress);

      if (wasPlaying) {
        this.master.play();
        this.props.setTimeLeftHandler(parseInt(this.master.getDuration() - this.master.getCurrentTime()));
      } else {
        this.props.setTimeLeftHandler(
            parseInt(this.master.getDuration() - this.master.getDuration() * progress)
        );
      }
    });

    const startSync = () => {
      this.syncHandle = setInterval(() => {
        this.slave.drawer.progress(
          this.master.getCurrentTime() / this.currentDuration
        );
      }, 100);
    };
  }

  render() {
    if (this.props.bpm && this.props.offset && this.props.isReady) {
      this.drawBeatBars(this.props.bpm, this.props.offset);
    }

    return (
      <div className={"player player-" + this.props.name}>
        {this.state.loadingProgress < 100 && this.state.loadingProgress > 0 && (
          <div className="player-loading">
            <span>Loading {this.state.loadingProgress} % </span>
          </div>
        )}
        <div className="master" ref={this.masterContainer} />
        <div className="slave" ref={this.slaveContainer} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  bpm: state.console.channel[ownProps.name].track.bpm,
  offset: state.console.channel[ownProps.name].playBackState.offset,
  isReady: state.console.channel[ownProps.name].playBackState.ready
});

const mapDispachToProps = (dispatch, ownProps) => ({
  setReadyHandler: status => dispatch(setChannelReady(status, ownProps.name)),
  setTimeLeftHandler: timeLeft => dispatch(setTimeLeft(ownProps.name, timeLeft))
});

export default connect(mapStateToProps, mapDispachToProps)(Player);
