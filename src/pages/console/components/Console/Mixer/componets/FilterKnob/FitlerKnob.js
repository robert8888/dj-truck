import React from "react";
import KnobDescribed from "./../../../../common/KnobDescribed/KnobDescribed";
import "./filter-knob.scss";
import withControlMapping from "../../../Control/withControlMapping";
import {connect} from "react-redux";

const FilterKnob = ({value, update, text}) =>{
    const displayText = (value) => {
        if (value < 0) {
            return "LP"
        } else if(value > 0){
            return "HP";
        } else 
            return ""
    }

    return (
        <KnobDescribed className="filter-knob "
            showValue={"always"} 
            symmetric
            scale={10} 
            text={text}
            displayFormula={ displayText }
            quantize={0.01} 
            onChange={ update }
            value={value}
            doubleClickInit/>
    )
}

const mapStateToProps = (state, {get}) => ({
    value : get && get(state),
})

const mapDispatchToProps = (dispatch, {set}) => ({
    update : (value) => dispatch(set(value))
})

export default  withControlMapping(connect(mapStateToProps, mapDispatchToProps)(FilterKnob));