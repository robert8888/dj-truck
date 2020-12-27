import React from "react";
import Console from "pages/console/core/console/console"
import "./sync-bar.scss";

class SyncBar extends React.Component {
  constructor() {
    super(...arguments);
    this.thumbElement = React.createRef();

    this.lastCall = false;
    this.break = true;
  }


  update() {
    if(this.break){
      return;
    }

    setTimeout( () => requestAnimationFrame(this.update.bind(this), 50));
    const now = new Date().getTime();

    if (now - this.lastCall > 100 && this.channelInterface) {
      this.lastCall = now;
      const position = this.channelInterface.getSyncBarPosition();
      this.applyStyle(position);
      this.updateBeatPositionSign(position);
    }
  }

  applyStyle(position) {
    let scale = 2 * position;
    let translateX = -((1 + scale) / 2 * 100);

    this.thumbElement.current.style.transform = "translateX(" + translateX + "%) scaleX(" + scale + ")"
  }

  updateBeatPositionSign(position){
    let sign = "idle";
    if(position > .1){
      sign = "ahead"
    } else if(position < -.1){
      sign = "delayed"
    }
    if(this.lastSign !== sign && this.props.updateBeatPosition){
      this.props.updateBeatPosition(sign)
    }
    this.lastSign = sign;
  }

  activate() {
    this.thumbElement.current.style.opacity = "1";
    this.break = false;
    this.update();
  }

  deActivate() {
    this.thumbElement.current.style.opacity = "0";
    this.break = true;
  }

  setInterface(){
    if(this.props.name === "idle") return;
    Console.Get().then( instance => {
      this.channelInterface = instance.getChannelInterface(this.props.name)
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.active) {
      this.activate();
    } else {
      this.deActivate();
    }
    if(prevProps.name !== this.props.name){
      this.setInterface();
    }
  }
  componentWillUnmount(){
    this.deActivate();
  }

  componentDidMount(){
    this.setInterface();
  }

  render() {
    return (
        <div className={this.props.className + " sync-bar-deck-" + this.props.name}>
          <div className="bar-area">
            <div ref={this.thumbElement} className="bar-thumb" />
          </div>
        </div>
    );
  }
}

export default SyncBar;