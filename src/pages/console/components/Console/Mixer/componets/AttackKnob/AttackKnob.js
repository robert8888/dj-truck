import React from "react";
import KnobDescribed from "./../../../../common/KnobDescribed/KnobDescribed";
import "./attack-knob.scss";


const AttackKnob = props =>{

    return (
        <KnobDescribed className={"attack-knob " + props.className}
            showValue  
            scale={1}
            text="Atc"
            initValue={.003}
            quantize={.001} 
            onChange={ props.onChange }
            doubleClickInit/>
    )
}

export default AttackKnob;