import React from "react";
import KnobDescribed from "./../../../../common/KnobDescribed/KnobDescribed";
import "./ratio-knob.scss";


const RatioKnob = props =>{

    return (
        <KnobDescribed className={"ratio-knob " + props.className}
            showValue 
            scale={20}
            initValue={1}
            alt="Ratio"
            quantize={1} 
            onChange={ props.onChange }
            dobuleClickInit/>
    )
}

export default RatioKnob;