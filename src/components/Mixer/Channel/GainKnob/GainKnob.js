import React from "react";
import Knob from "./../../../common/Knob/Knob";
import "./gain-knob.scss";


const GainKnob = props =>{
    return (
        <Knob className={"gain-knob " + props.className} 
            showValue 
            scale={100} 
            initValue={75}
            quantize={5} 
            onChange={ props.onChange }/>
    )
}

export default GainKnob;
