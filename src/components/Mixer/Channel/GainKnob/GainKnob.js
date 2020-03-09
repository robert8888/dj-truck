import React from "react";
import Knob from "./../../../common/Knob/Knob";
import "./gain-knob.scss";


const GainKnob = props =>{
    return (
        <Knob className={"gain-knob " + props.className} 
            showValue 
            scale={100} 
            unsymetric={{positive:4}}
            alt="Gain"
            quantize={{negative: 5, positive:1}} 
            onChange={ props.onChange }/>
    )
}

export default GainKnob;
