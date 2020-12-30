import React from "react";
import KnobDescribed from "./../../../../common/KnobDescribed/KnobDescribed";
import "./eq-knob.scss";
import withControlMapping from "../../../Control/withControlMapping";
import {connect} from "react-redux";

const EqKnob = ({update, value, className, text}) =>{

    return (
        <KnobDescribed className={"eq-knob " + (className || "")}
            showValue 
            asymmetric={{positive:5}}
            scale={50}
            text={text}
            quantize={{negative: 1, positive:0.1}} 
            onChange={ update }
            value={ value }
            responseFactor={.4}
            doubleClickInit/>
    )
}

const mapStateToProps = (state, {get}) => ({
    value : get(state),
})

const mapDispatchToProps = (dispatch, {set}) => ({
    update : (value) => dispatch(set(value))
})

export default withControlMapping(connect(mapStateToProps, mapDispatchToProps)(EqKnob));