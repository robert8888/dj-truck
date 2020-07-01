import React from "react";
import Console from "./../../../../../core/console/console"
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

    if (now - this.lastCall > 100) {
      this.lastCall = now;
      const position = this.channelInterface.getSyncBarPosition();
      this.applyStyle(position);
    }
  }

  applyStyle(position) {

    let scale = 2 * position;
    let translateX = -((1 - scale) / 2 * 100);

    if (position < 0) {
      scale *= -1;
    }

    this.thumbElement.current.style.transform = "translateX(" + translateX + "%) scaleX(" + scale + ")"
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

  componentDidUpdate() {
    if (this.props.active) {
      this.activate();
    } else {
      this.deActivate();
    }
  }
  componentWillUnmount(){
    this.deActivate();
  }

  componentDidMount(){
    Console.Get().then( instance =>
        this.channelInterface = instance.getChannelInterface(this.props.name)
    )
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
