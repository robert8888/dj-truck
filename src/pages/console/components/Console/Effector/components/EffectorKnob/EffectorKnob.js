import React from "react";
import KnobDescribed from "./../../../../common/KnobDescribed/KnobDescribed"
import "./effector-knob.scss";


const EffectorKnob = props =>{


    return (
        <KnobDescribed className="effector-knob " {...props}/>
    )
}

export default EffectorKnob;