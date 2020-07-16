import React from "react";
import KnobDescribed from "./../../../../common/KnobDescribed/KnobDescribed"
import "./resonans-knob.scss";
import withControlMapping from "../../../Control/withControlMapping";
import {connect} from "react-redux";

const ResonanceKnob = ({update, value, text}) =>{

    return (
        <KnobDescribed className="filter-resonance-knob "
            showValue
            scale={20} 
            text={text}
            quantize={1} 
            onChange={ update }
            value={ value}
            doubleClickInit/>
    )
}

const mapStateToProps = (state, {get}) => ({
    value : get && get(state),
})

const mapDispatchToProps = (dispatch, {set}) => ({
    update : (value) => dispatch(set(value))
})

export default withControlMapping(connect(mapStateToProps, mapDispatchToProps)(ResonanceKnob));