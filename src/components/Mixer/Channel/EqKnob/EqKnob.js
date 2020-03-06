import React from "react";
import Knob from "./../../../common/Knob/Knob"
import "./eq-knob.scss";


const EqKnob = props =>{
    return (
        <Knob className={"eq-knob " + props.className} 
            showValue 
            unsymetric={{positive:5}} 
            scale={30} 
            quantize={{negative: 1, positive:0.1}} 
            onChange={ props.onChange }/>
    )
}

export default EqKnob;