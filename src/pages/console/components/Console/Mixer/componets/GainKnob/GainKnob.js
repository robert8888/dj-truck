import React from "react";
import KnobDescribed from "./../../../../common/KnobDescribed/KnobDescribed";
import "./gain-knob.scss";
import withControlMapping from "../../../Control/withControlMapping";
import {connect} from "react-redux";

const GainKnob = ({value, update}) =>{
    return (
        <KnobDescribed className="gain-knob "
            showValue 
            scale={100} 
            asymmetric={{positive:4}}
            text="Gain"
            quantize={{negative: 5, positive:1}} 
            onChange={ update }
            value={value}
            doubleClickInit/>
    )
}

const mapStateToProps = (state, {get}) => ({
    value : get && get(state),
})

const mapDispatchToProps = (dispatch, {set, update}) => ({
    update : (value) => (update && update(value)) || (set && dispatch(set(value)))
})

export default withControlMapping(connect(mapStateToProps, mapDispatchToProps)(GainKnob));
