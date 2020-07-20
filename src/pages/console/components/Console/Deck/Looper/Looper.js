import React from "react";
import {connect} from "react-redux";
import MiniSlider from "./MiniSlider/MiniSlider";
import "./looper.scss";
import {MAPPING, setLoop, setLoopLength} from "../../../../../../actions";
import InButton from "./InButton";
import OutButton from "./OutButton";

const mapStateToProps = (state, ownProps) => ({
    loopState : state.console.channel[ownProps.name].playBackState.loop,
    loopLengths: state.console.channel[ownProps.name].deckState.loopLengths,
    loopLengthValue : state.console.channel[ownProps.name].deckState.loopLength.current,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    setLoop : (value) => dispatch(setLoop(ownProps.name, value)),
    setLoopLength : (value) => dispatch(setLoopLength(ownProps.name, value))
})

class Looper extends React.Component {
  constructor(...args) {
    super(...args);
    this.sliderElement = React.createRef();
    this.state = {
      position: 0,
    };

    this.sliderItems =
        this.props.loopLengths.map(length => {
            let display = length;
            if (length < 1) {
                display = "1/" + 1 / length;
            }
            return display;
        })
  }

  sliderValueChange(currentSlide) {
    this.props.setLoopLength(currentSlide);
  }

   render() {
   const {name} = this.props;
    return (
      <div className={"controls__looper controls__looper--" + name}>
        <InButton  onClick={this.props.setLoop.bind(null, true)}
                   state={this.props.loopState}
                   role={MAPPING[`DECK_CHANNEL_${name}_LOOP_IN`]}/>
        <OutButton onClick={this.props.setLoop.bind(null, false)}
                   role={MAPPING[`DECK_CHANNEL_${name}_LOOP_OUT`]}/>
        <MiniSlider
          onChange={this.sliderValueChange.bind(this)}
          className={"mini-slider--" + name}
          slides={this.sliderItems}
          value={this.props.loopLengthValue}
          role={MAPPING[`DECK_CHANNEL_${name}_LOOP_LENGTH`]}
        />
      </div>
    );
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(Looper);
