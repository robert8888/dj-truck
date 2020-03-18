import React from "react";
import KnobDescribed from "./../../../common/KnobDescribed/KnobDescribed"
import "./eq-knob.scss";


const EqKnob = props =>{
    const toDbValue = (value) => {
        let dB = 20 * Math.log10(Math.abs(value));
        dB = (value < 0 ) ? -1 * dB : dB;
        return Math.floor(dB * 100) / 100;
    }

    return (
        <KnobDescribed className="eq-knob "
            showValue 
            unsymetric={{positive:5}} 
            scale={50} 
            alt={props.alt}
           // displayFormula={ toDbValue }
            quantize={{negative: 1, positive:0.1}} 
            onChange={ props.onChange }/>
    )
}

export default EqKnob;