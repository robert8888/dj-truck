import React from "react";
import KnobDescribed from "./../../../../common/KnobDescribed/KnobDescribed"
import "./resonans-knob.scss";


const ResonansKnob = props =>{

    return (
        <KnobDescribed className="filter-knob "
            showValue
            scale={100} 
            alt={props.alt}
            quantize={1} 
            onChange={ props.onChange }
            value={props.value}
            dobuleClickInit/>
    )
}

export default ResonansKnob;