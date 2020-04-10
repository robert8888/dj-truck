import React from "react";
import KnobDescribed from "./../../../../common/KnobDescribed/KnobDescribed";
import "./release-knob.scss";


const ReleaseKnob = props =>{

    return (
        <KnobDescribed className={"release-knob " + props.className}
            showValue  
            scale={1}
            alt="Rel"
            initValue={.25}
            quantize={.05} 
            onChange={ props.onChange }
            dobuleClickInit/>
    )
}

export default ReleaseKnob;