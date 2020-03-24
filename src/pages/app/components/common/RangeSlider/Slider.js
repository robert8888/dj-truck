import React from "react";
import "./slider.scss";

class Slider extends React.Component {
  constructor() {
    super();

    this.sliderRangeElement = React.createRef();
    this.sliderThumbElement = React.createRef();
    this.sliderAreaElement = React.createRef();
  }

  state = {

    sliderRange: null,
    sliderCurrnetPosition: null,
    sliderPrevPosition: null,
    isDragged: false,
    isTemp: false, // is temporary value return as second arguemnt onChange callback

    thumbSize: 0,
    sliderAreaOffset: 0
  };

  static getRange = (from, to) => {
    return {
      from,
      to,
      range: from * to < 0 ? Math.abs(to) + Math.abs(from) : to - from
    };
  };

  getPostion = (value) => {
    const { from, range } = Slider.getRange(this.props.from, this.props.to);
    const progress = (value - from) / range;
    const position = progress * this.state.sliderRange;
    return position + this.state.thumbSize / 2;
  };



  evalValue = position => {
    const { from, range } = Slider.getRange(this.props.from, this.props.to);
    const progress =
      (position - this.state.thumbSize / 2) / this.state.sliderRange;

    let value = range * progress + from;
    return value;
  };

  setValue = value => {
    const { from, range } = Slider.getRange(this.props.from, this.props.to);
    const progress = (value - from) / range;
    const position = progress * this.state.sliderRange;
    this.setPosition(position + this.state.thumbSize / 2);
  };

  boundPosition(position) {
    return Math.min(
      Math.max(position, this.state.thumbSize / 2),
      this.state.sliderRange + this.state.thumbSize / 2
    );
  }

  stickiPostion(position) {
    if (this.props.stickiZero && this.props.from * this.props.to < 0) {
      let valueFromPostion = this.evalValue(position);
      if (Math.abs(valueFromPostion) - this.props.stickiZero < 0) {
        return Slider.getPostion(0, this.state, this.props);
      }
    }
    return position;
  }

  setPosition = (currentPosition, prevPosition) => {
    let position = this.boundPosition(currentPosition);

    this.setState(
      {
        ...this.state,
        sliderCurrnetPosition: position,
        sliderPrevPosition: prevPosition || this.state.sliderPrevPosition
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(
            this.evalValue(this.state.sliderCurrnetPosition),
            this.state.isTemp
          );
        }
      }
    );

    this.updateStyles();
  };

  updateStyles(){

    let position = this.stickiPostion(this.state.sliderCurrnetPosition);
    if (this.props.horizontal) {
      this.sliderThumbElement.current.style.left = position + "px";
      //thumbStyle.left = position;
    } else {
      this.sliderThumbElement.current.style.top = position + "px";
      //thumbStyle.top = position;
    }
  
  }

  mouseDownHandle = event => {
    if (
      event.target === this.sliderAreaElement.current ||
      event.target === this.sliderRangeElement.current
    ) {
      //temporary jummp
      this.setState({ ...this.state, isTemp: true });
      const rect = this.sliderAreaElement.current.getBoundingClientRect();
      const position = this.props.horizontal
        ? event.clientX - rect.left
        : event.clientY - rect.top;
      this.setPosition(position, this.state.sliderCurrnetPosition);
    } // dragging
    else if (event.target === this.sliderThumbElement.current) {
      this.setState({ ...this.state, isDragged: true });
      const rect = this.sliderThumbElement.current.getBoundingClientRect();
      const shiftY = event.clientY - rect.top;
      const shiftX = event.clientX - rect.left;
      document.addEventListener("mousemove", e =>
        this.mouseMoveHandler.call(this, e, shiftY, shiftX)
      );
      document.addEventListener("dragstart", e => e.preventDefault());
    }

    document.addEventListener("mouseup", this.mouseUpHandler);
    document.addEventListener("dragend", this.mouseUpHandler);
  };

  mouseUpHandler = event => {
    if (this.state.isDragged) {
      this.setState({ ...this.state, isDragged: false });
    } else {
      this.setState({ ...this.state, isTemp: false });
      if (this.props.step) {
        const step = this.props.step;
        let prevVal = this.evalValue(this.state.sliderPrevPosition);
        if (this.state.sliderCurrnetPosition > this.state.sliderPrevPosition) {
          prevVal += step;
        } else {
          prevVal -= step;
        }
        this.setPosition(Slider.getPostion(prevVal, this.state, this.props));
      } else {
        this.setPosition(this.state.sliderPrevPosition);
      }
    }

    document.removeEventListener("mousemove", this.mouseMoveHandler.bind(this));
    document.removeEventListener("mouseup", this.mouseUpHandler);
    document.removeEventListener("dragend", this.mouseUpHandler);
  };

  mouseMoveHandler = (event, shiftY, shiftX) => {
    if (!this.state.isDragged) return;
    let position;
    if (this.props.horizontal) {
      position =
        event.clientX -
        this.state.sliderAreaOffset -
        shiftX +
        this.state.thumbSize / 2;
    } else {
      position =
        event.clientY -
        this.state.sliderAreaOffset -
        shiftY +
        this.state.thumbSize / 2;
    }
    this.setPosition(position);
  };

  componentDidMount() {
    const updateState = () => {
      const thumbRect = this.sliderThumbElement.current.getBoundingClientRect();
      const areaRect = this.sliderAreaElement.current.getBoundingClientRect();
      const computedStyleThumbElement = window.getComputedStyle(
        this.sliderThumbElement.current
      );
      const computedStyleRangeElement = window.getComputedStyle(
        this.sliderRangeElement.current
      );

      this.setState(
        state => {
          const _state = { ...state };
          if (this.props.horizontal) {
            _state.sliderCurrnetPosition = parseInt(
              computedStyleThumbElement.left
            );
            _state.sliderRange = parseInt(computedStyleRangeElement.width);
            _state.sliderAreaOffset = areaRect.left;
            _state.thumbSize = thumbRect.width;
          } else {
            _state.sliderCurrnetPosition = parseInt(
              computedStyleThumbElement.top
            );
            _state.sliderRange = parseInt(computedStyleRangeElement.height);
            _state.sliderAreaOffset = areaRect.top;
            _state.thumbSize = thumbRect.height;
          }
          return _state;
        },
        () => {
          if (this.props.value !== undefined) {
            this.setValue(this.props.value);
          }
        }
      );
    };
    updateState();
    window.addEventListener("resize", updateState.bind(this));

    this.sliderAreaElement.current.addEventListener(
      "mousedown",
      this.mouseDownHandle.bind(this)
    );
  }

  componentDidUpdate(prevProbs){
    if( this.props.value && this.props.value !== prevProbs.value){
      let position = this.getPostion(this.props.value);
      if(position !== this.state.sliderCurrnetPosition){
        this.setPosition(position);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return (this.props.value !== nextProps.value)
  }

  render() {
    
    return (
      <div 
        className={ "slider" + (this.props.className ? " " + this.props.className : "")}
      >
        <div ref={this.sliderAreaElement} className="slider-area">
          <div ref={this.sliderRangeElement} className="slider-range" />
          <div
            className="slider-thumb"
            ref={this.sliderThumbElement}
            
          />
        </div>
      </div>
    );
  }
}

export default Slider;
