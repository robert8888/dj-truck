import React from "react";
import debounce from "lodash/debounce";
import "./slider.scss";

//props
//from - down boundary
//to  - up boundary value
//onChange - handler for change
//value - value to make external control
//step - for quantize value
//stick-zero - stick zero to sticky mode
//vertical or horizontal - vertical or horizontal position


class Slider extends React.Component {
  //helper
  preventDrag(e){ e.preventDefault() }

  constructor() {
    super();

    this.sliderRangeElement = React.createRef();
    this.sliderThumbElement = React.createRef();
    this.sliderAreaElement = React.createRef();
  }

  state = {

    sliderRange: null,
    sliderCurrentPosition: null,
    sliderPrevPosition: null,
    isDragged: false,
    isTemp: false, // is temporary value return as second arguemnt onChange callback

    thumbSize: 0,
    sliderAreaOffset: 0
  };

  getRange () {
    const from = this.props.from;
    const to = this.props.to;
    return {
      from,
      to,
      range: from * to < 0 ? Math.abs(to) + Math.abs(from) : to - from
    };
  };

  getPostion = (value) => {
    const { from, range } = this.getRange();
    const progress = (value - from) / range;
    const position = progress * this.state.sliderRange;
    return position + this.state.thumbSize / 2;
  };



  evalValue = position => {
    const { from, range } = this.getRange(this.props.from, this.props.to);
    const progress =
      (position - this.state.thumbSize / 2) / this.state.sliderRange;

    let value = range * progress + from;
    return value;
  };

  setValue = value => {
    const { from, range } = this.getRange();
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
        return this.getPostion(0, this.state, this.props);
      }
    }
    return position;
  }

  update(){
    if (this.props.onChange) {
      let value = this.evalValue(this.state.sliderCurrentPosition);
      if(isNaN(value)) return;
      this.props.onChange(
          value,
          this.state.isTemp
      );
    }
  }

  setPosition = (currentPosition, prevPosition) => {
    let position = this.boundPosition(currentPosition);
    this.setState(
      {
        ...this.state,
        sliderCurrentPosition: position,
        sliderPrevPosition: prevPosition || this.state.sliderPrevPosition
      },
      () => {
        this.update();
        this.updateStyles();
      }
    );
  };

  updateStyles(){
    let position = this.stickiPostion(this.state.sliderCurrentPosition);
    if (this.props.horizontal) {
      this.sliderThumbElement.current.style.left = position + "px";
      this.sliderThumbElement.current.style.top = null;
    } else {
      this.sliderThumbElement.current.style.top = position + "px";
      this.sliderThumbElement.current.style.left = null;
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
      
      const current = this.state.sliderCurrentPosition || this.getPostion(this.props.initValue || 0) 
      this.setPosition(position, current);
    } // dragging
    else if (event.target === this.sliderThumbElement.current) {
      this.setState({ ...this.state, isDragged: true });
      const rect = this.sliderThumbElement.current.getBoundingClientRect();
      const shiftY = event.clientY - rect.top;
      const shiftX = event.clientX - rect.left;
      document.addEventListener("mousemove", e =>
        this.mouseMoveHandler.call(this, e, shiftY, shiftX)
      );
      document.addEventListener("dragstart", this.preventDrag);
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
        if (this.state.sliderCurrentPosition > this.state.sliderPrevPosition) {
          prevVal += step;
        } else {
          prevVal -= step;
        }
        this.setPosition(this.getPostion(prevVal));
      } else {
        this.setPosition(this.state.sliderPrevPosition);
      }
    }

    document.removeEventListener("mousemove", this.mouseMoveHandler.bind(this));
    document.removeEventListener("mouseup", this.mouseUpHandler);
    document.removeEventListener("dragend", this.mouseUpHandler);
    document.removeEventListener("dragstart", this.preventDrag);
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

  updateState(){
    if(!this.sliderThumbElement.current || !this.sliderAreaElement) return;
    
    const thumbRect = this.sliderThumbElement.current.getBoundingClientRect();
    const areaRect = this.sliderAreaElement.current.getBoundingClientRect();
    const rangeRect = this.sliderRangeElement.current.getBoundingClientRect();

    this.setState(
      state => {
        const _state = { ...state };
        if (this.props.horizontal) {
          _state.sliderRange = rangeRect.width;
          _state.sliderAreaOffset = areaRect.left;
          _state.thumbSize = thumbRect.width;
        } else {
          _state.sliderRange = rangeRect.height;
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

  componentDidMount() {

    setTimeout(this.updateState.bind(this), 100) ;

    this.updateStateDebounced = debounce(this.updateState.bind(this), 300)
    window.addEventListener("resize", this.updateStateDebounced);

    this.sliderAreaElement.current
      .addEventListener("mousedown",this.mouseDownHandle.bind(this));
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.updateStateDebounced);
  }

  componentDidUpdate(prevProbs){
    if( this.props.value !== undefined &&
        this.props.value !== this.state.value &&
        !this.state.isDragged){
      this.setPosition(this.getPostion(this.props.value));
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
