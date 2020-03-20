
// Spec 
// witout any option Knob is standard with value from 0 to 100 and on inti value is 0
// -initValue:number allow to set init value
// -showValue props allows to display numeric value on knob
// -diplayFormula : a callbac function with will be used to show value on knob
// -scale:number allow to scale value eg. 10 give range from 0 to 10 
// -symetric:boolean if this props is present knob havse valeu from -100 to 100 * scale 
// -unsymetric:{negative:number, positive:number} allows to set unsymetric range value : 
//  {positive : 5 } means that values bigger than 0 are divided by 5 range is from -100 to 20 * scale
// -quantize:number switch knob to quantize mode in witch returned values are quantize to parametr 
//       eg: 2 returns value 100, 98 , 96 ... quantize:0.05 returns values 100, 99.95.... 
// -qunatize:{negative:number, positive:number} allows to set diffrent qunatizes for negative and positives values.
// -responseFactor if is present adjust knob response on a mouse move // default= 1 eg responseFactor 2 will increase response two times
// -alt if is present when mouse is over and knob is not draggin it will display alt value 
import React from "react";
import Knob from "./../Knob/Knob";
import "./knob-described.scss"

const KnobDescribed = (props) => {
    const {alt, ... rest} = props;
    
    return (
        <div className={"knob-area " + props.className}>
             <Knob {...rest}></Knob>
             <div className="knob-ring"/>
             <div className="knob-text">{alt.toUpperCase()}</div>

             <div className="ring-indicators">
                <div className="ring-indicator"/>
                <div className="ring-indicator"/>
                <div className="ring-indicator"/>
                <div className="ring-indicator"/>
                <div className="ring-indicator"/>
                <div className="ring-indicator"/>
                <div className="ring-indicator"/>
                <div className="ring-indicator"/>
                <div className="ring-indicator"/>
                <div className="ring-indicator"/>
                <div className="ring-indicator"/>
             </div>
        </div>

    )
}

export default KnobDescribed;