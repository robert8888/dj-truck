import React from "react";
import withRefSize from "./../../../../../../common/components/HOC/withRefSize";
import withControlMapping from "../../../Control/withControlMapping";
import "./mini-slider.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

class MiniSlider extends React.Component {
  constructor(...args) {
    super(...args);
    this.ref = React.createRef();
    this.state = {
      currentSlide: this.props.value || 0,
    };
    (this.props.onChange && this.props.onChange(this.state.currentSlide))
  }

  updateSlide(nextSlide){
    this.setState({ ...this.state, currentSlide: nextSlide });
    (this.props.onChange && this.props.onChange(nextSlide))
  }

  nextSlide(){
    let currentSlide  = this.state.currentSlide;
    if(currentSlide >= this.props.slides.length - 1) return;

    currentSlide++;
    this.updateSlide(currentSlide);
  }

  prevSlide(){
    let currentSlide  = this.state.currentSlide;
    if(this.props.slides.length < 1) return;

    currentSlide--;
    this.updateSlide(currentSlide);
  }

  changeSlide(event) {
    let x = event.clientX  - event.target.getBoundingClientRect().left;
    const clickSide = ( x > this.props.size.container.width / 2) ? "right" : "left";

    if(clickSide === "right"){
      this.nextSlide();
    } else if(clickSide === "left"){
      this.prevSlide();
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.value === undefined || prevProps.value === this.state.currentSlide) return;
    this.updateSlide(this.props.value);
  }

  render() {
    const listStyle = {
      transform: "translateX(-" + this.state.currentSlide + "00%)",
    };

    const classNames = this.props.className || "";

    return (
      <div
        className={"slider-container " + classNames}
        onClick={this.changeSlide.bind(this)}
        ref={this.props.exportRef.bind(this, "container")}>
          <FontAwesomeIcon icon={faCircle} className="ctr ctr-minus" />
          <FontAwesomeIcon icon={faCircle} className="ctr ctr-plus" />
          <ul className="slider-list" style={listStyle}>
            {this.props.slides.map((content, index) => (
              <li className="slider-list-item"
                  key={index}>
                {content}
              </li>
            ))}
          </ul>
      </div>
    );
  }
}

export default withControlMapping(withRefSize(MiniSlider));
