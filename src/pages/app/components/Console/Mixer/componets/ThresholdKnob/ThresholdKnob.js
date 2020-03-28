import React from "react";
import KnobDescribed from "./../../../../common/KnobDescribed/KnobDescribed";
import "./threshold-knob.scss";


const ThresholdKnob = props =>{

    return (
        <KnobDescribed className={"threshold-knob " + props.className}
            showValue 
            scale={-100}
            alt="Thres"
            initValue={0}
            quantize={.5} 
            onChange={ props.onChange }
            dobuleClickInit/>
    )
}

export default ThresholdKnob;