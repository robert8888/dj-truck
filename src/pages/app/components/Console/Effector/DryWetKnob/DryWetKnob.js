import React from "react";
import KnobDescribed from "./../../../common/KnobDescribed/KnobDescribed"
import "./dry-wet-knob.scss";


const DryWetKnob = props =>{


    return (
        <KnobDescribed className="dry-wet-knob "
            showValue 
            alt={props.alt}
            quantize={5} 
            initValue={0}
            onChange={ props.onChange }
            dobuleClickInit/>
    )
}

export default DryWetKnob;