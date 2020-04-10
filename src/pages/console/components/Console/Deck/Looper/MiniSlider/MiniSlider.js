import React from "react";
import withRefSize from "./../../../../common/HOC/withRefSize";
import "./mini-slider.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

class MiniSlider extends React.Component {
  constructor(...args) {
    super(...args);
    this.ref = React.createRef();
    this.state = {
      currentSlide: this.props.initValue || 0,
    };
    (this.props.onChange && this.props.onChange(this.state.currentSlide))
  }


  changeSlide(event) {
    let nextSlide = this.state.currentSlide;
    
    let x = event.clientX  - event.target.getBoundingClientRect().left;


    const clickSide = ( x > this.props.size.container.width / 2) ? "right" : "left";
    if (clickSide === "right" && nextSlide < this.props.renderItems.length - 1) {
      nextSlide++;
    } else if (clickSide === "left" && nextSlide >= 1) {
      nextSlide--;
    }
    this.setState({ ...this.state, currentSlide: nextSlide });
    (this.props.onChange && this.props.onChange(nextSlide))
  }


  render() {
    const listStyle = {
      transform: "translateX(-" + this.state.currentSlide + "00%)",
    };

    const hocEvnetsHandlers = this.props.evnetsHandlers || {};
    const classNames = this.props.className || "";

    return (
      <div
        className={"slider-container " + classNames}
        onClick={this.changeSlide.bind(this)}
        ref={this.props.exportRef.bind(this, "container")}>
          <FontAwesomeIcon icon={faCircle} className="ctr ctr-minus" />
          <FontAwesomeIcon icon={faCircle} className="ctr ctr-plus" />
          <ul className="slider-list" style={listStyle}>
            {this.props.renderItems.map(item => item)}
          </ul>
      </div>
    );
  }
}

export default withRefSize(MiniSlider);
