import React from "react";
import {connect} from "react-redux";
import { Button } from "react-bootstrap";
import MiniSlider from "./MiniSlider/MiniSlider";
import "./looper.scss";
import {setLoop, setLoopLength} from "./.././../../actions";

class Looper extends React.Component {
  constructor() {
    super();
    this.sliderElement = React.createRef();
    this.state = {
      lengths: [],
      position: 0,
    };

    for (let i = 1 / 64; i <= 64; i = i * 2) {
      this.state.lengths.push(i);
    }
  }

  sliderValueChange(currentSlide) {
    this.props.setLoopLength(this.state.lengths[currentSlide]);
  }

  render() {
    const listItems = this.state.lengths.map((length, index) => {
        let display = length;
        if (length < 1) {
            display = "1/" + 1 / length;
        }

        return (<li className="slider-list-item" 
                    key={index} 
                    data-value={length}>
                        {display}
                </li>);
    });

    return (
      <div className={"looper looper-deck-" + this.props.name}>
        <Button className={"btn-in" + ((this.props.loopState) ? " btn--pressed-filed" : "")}
                onClick={this.props.setLoop.bind(null, true)}>
                  IN
        </Button>
        <Button className="btn-out" onClick={this.props.setLoop.bind(null, false)}>OUT</Button>
        <MiniSlider
          onChange={this.sliderValueChange.bind(this)}
          className={"mini-slider-deck-" + this.props.name}
          renderItems={listItems}
          initValue={8}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
    loopState : state.console.channel[ownProps.name].playBackState.loop,
})

const mapDispachToProps = (dispatch, ownProps) => ({
    setLoop : (value) => dispatch(setLoop(ownProps.name, value)),
    setLoopLength : (value) => dispatch(setLoopLength(ownProps.name, value))
})

export default connect(mapStateToProps, mapDispachToProps)(Looper);
