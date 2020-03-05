import React from "react";
import { connect } from "react-redux";
import { setPitch } from "../../../actions/actions";
import Slider from "./Slider/Slider";
import "./pitch-slider.scss";

const PitchSlider = props => {
    return (
        <div className={"pitch pitch-" + props.name} >
            <Slider from={-8} to={8} initValue={0} onChange={props.setPitch} value={ props.pitch } quantize={0.01}/>
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
