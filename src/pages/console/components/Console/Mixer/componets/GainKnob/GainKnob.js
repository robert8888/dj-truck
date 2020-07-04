import React from "react";
import KnobDescribed from "./../../../../common/KnobDescribed/KnobDescribed";
import "./gain-knob.scss";
import withControlMapping from "../../../Control/withControlMapping";

const GainKnob = props =>{
    return (
        <KnobDescribed className="gain-knob "
            showValue 
            scale={100} 
            unsymetric={{positive:4}}
            alt="Gain"
            quantize={{negative: 5, positive:1}} 
            onChange={ props.onChange }
            dobuleClickInit/>
    )
}

export default withControlMapping(GainKnob);
