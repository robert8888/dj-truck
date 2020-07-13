import React from "react";
import KnobDescribed from "./../../../../common/KnobDescribed/KnobDescribed"
import withControlMapping from "../../../Control/withControlMapping";
import "./dry-wet-knob.scss";
import {connect} from "react-redux";

const DryWetKnob = ({value, update}) =>{
    return (
        <KnobDescribed className="knob knob__dw "
            showValue 
            text={"D/W"}
            quantize={5} 
            initValue={0}
            value={value}
            onChange={ update }
            doubleClickInit/>
    )
}

const mapStateToProps = (state, {get}) => ({
    value : get(state),
})

const mapDispatchToProps = (dispatch, {set}) => ({
    update : (value) => dispatch(set(value))
})

export default withControlMapping(connect(mapStateToProps,mapDispatchToProps)(DryWetKnob));