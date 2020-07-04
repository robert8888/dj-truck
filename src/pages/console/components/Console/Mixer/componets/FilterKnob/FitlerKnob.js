import React from "react";
import KnobDescribed from "./../../../../common/KnobDescribed/KnobDescribed";
import "./filter-knob.scss";
import withControlMapping from "../../../Control/withControlMapping";

const FilterKnob = props =>{
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
            symetric
            scale={10} 
            alt={props.alt}
            displayFormula={ displayText }
            quantize={0.01} 
            onChange={ props.onChange }
            value={props.value}
            dobuleClickInit/>
    )
}

export default  withControlMapping(FilterKnob);