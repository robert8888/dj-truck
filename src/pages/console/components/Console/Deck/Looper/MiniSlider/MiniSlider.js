import React from "react";
import withControlMapping from "../../../Control/withControlMapping";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import "./mini-slider.scss";

class MiniSlider extends React.Component {
  constructor(...args) {
    super(...args);
    this.ref = React.createRef();
    this.container = React.createRef();
    this.state = {
      currentSlide: this.props.value || 0,
    };
    (this.props.onChange && this.props.onChange(this.state.currentSlide))
  }

  updateSlide(nextSlide){
    (this.props.onChange && this.props.onChange(nextSlide))
    this.setState({ ...this.state, currentSlide: nextSlide });
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
    const containerRect = this.container.current.getBoundingClientRect()
    let x = (event.clientX || event.touches[0].clientX) - containerRect.left;
    const clickSide = ( x > containerRect.width / 2) ? "right" : "left";

    if(clickSide === "right"){
      this.nextSlide();
    } else if(clickSide === "left"){
      this.prevSlide();
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.value === undefined || this.props.value === this.state.currentSlide) return;
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
        ref={this.container}>
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

export default withControlMapping(MiniSlider);
