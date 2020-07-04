import React from "react";
import KnobDescribed from "./../../../../common/KnobDescribed/KnobDescribed";
import "./eq-knob.scss";
import withControlMapping from "../../../Control/withControlMapping";
const EqKnob = props =>{

    return (
        <KnobDescribed className={"eq-knob " + props.className}
            showValue 
            unsymetric={{positive:5}} 
            scale={50}
            alt={props.alt}
            quantize={{negative: 1, positive:0.1}} 
            onChange={ props.onChange }
            dobuleClickInit/>
    )
}

export default withControlMapping(EqKnob);