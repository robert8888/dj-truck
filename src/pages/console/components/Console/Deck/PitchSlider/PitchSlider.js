import React from "react";
import { connect } from "react-redux";
import { setPitch, MAPPING } from "actions";
import Slider from "./../../../common/RangeSlider/Slider";
import "./pitch-slider.scss";
import withControlMapping from "../../Control/withControlMapping";

const PitchSlider = ({name, pitch, setPitch, min, max}) => {
    return (
        <div className={"pitch pitch-" + name} >
            <Slider from={min} to={max} onChange={setPitch} value={ pitch }/>
        </div>
    )
}

const ControlledPitchSlider = withControlMapping(PitchSlider);

const MappedPitchSlider = ({name, ...props}) =>{
    return <ControlledPitchSlider {...props} name={name} role={MAPPING[`DECK_CHANNEL_${name}_PITCH`]}/>
}

const mapStateToProps = (state, ownProps) =>({
    min: state.console.channel[ownProps.name].playBackState.pitch.min,
    max: state.console.channel[ownProps.name].playBackState.pitch.max,
    pitch : state.console.channel[ownProps.name].playBackState.pitch.current,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    setPitch : (value) => dispatch(setPitch(ownProps.name, value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MappedPitchSlider);
