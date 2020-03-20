import React from "react";
import { connect } from "react-redux";
import { setPitch } from "../../../../../../actions";
import Slider from "./../../../common/RangeSlider/Slider";
import "./pitch-slider.scss";

const PitchSlider = props => {
    return (
        <div className={"pitch pitch-" + props.name} >
            <Slider from={-8} to={8}  onChange={props.setPitch} value={ props.pitch }/>
        </div>
    )
}

const mapStateToProps = (state, ownProps) =>({
    pitch : state.console.channel[ownProps.name].playBackState.pitch,
})

const mapDispachToProps = (dispach, ownProps) => ({
    setPitch : (value) => dispach(setPitch(value, ownProps.name)), 
})

export default connect(mapStateToProps, mapDispachToProps)(PitchSlider);
