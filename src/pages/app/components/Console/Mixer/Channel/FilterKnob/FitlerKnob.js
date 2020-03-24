import React from "react";
import KnobDescribed from "./../../../../common/KnobDescribed/KnobDescribed";
import "./filter-knob.scss";


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
            scale={8000} 
            alt={props.alt}
            displayFormula={ displayText }
            quantize={100} 
            onChange={ props.onChange }
            value={props.value}
            dobuleClickInit/>
    )
}

export default FilterKnob;