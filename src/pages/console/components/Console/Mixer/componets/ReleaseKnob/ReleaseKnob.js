import React from "react";
import KnobDescribed from "./../../../../common/KnobDescribed/KnobDescribed";
import "./release-knob.scss";


const ReleaseKnob = props =>{

    return (
        <KnobDescribed className={"release-knob " + props.className}
            showValue  
            scale={1}
            text="Rel"
            initValue={.25}
            quantize={.05} 
            onChange={ props.onChange }
            doubleClickInit/>
    )
}

export default ReleaseKnob;