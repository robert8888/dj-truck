import React from "react";
import Knob from "./../Knob/Knob";
import "./knob-described.scss"
import PropTypes from "prop-types"

const KnobDescribed = (props) => {
    const {text, ...rest} = props;
    
    return (
        <div className={"knob-area " + props.className}>
             <Knob {...rest}/>
             <div className="knob-ring"/>
             <div className="knob-text">{text && text.toUpperCase()}</div>

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

KnobDescribed.propTypes = {
    initValue: PropTypes.number, //allow to set init value
    showValue: PropTypes.oneOfType([
        PropTypes.bool, //display numeric value on knob on hover
        PropTypes.oneOf(["always"]), // all time
    ]),
    displayFormula: PropTypes.func, // allow to pass function witch transform displayed value
    scale: PropTypes.number,// scale value eg. 10 give range from 0 to 10 - (100 / scale)
    symmetric: PropTypes.bool, // if is true instead value from 0 to 100 / scale - it will have from -100 to 100
    asymmetric: PropTypes.shape({ // allows to set asymmetric scale
        negative: PropTypes.number, // eg: negative: 2 makes negative value dived by 2 - instead -100 to 100 gives: -50 to 100
        positive: PropTypes.number, //
    }),
    quantize: PropTypes.oneOfType([
        PropTypes.number, // eg:  value : 2 -> 100, 98 , 96....
        PropTypes.shape({
            negative: PropTypes.number, // asymmetric quantization
            positive: PropTypes.number, //
        })
    ]),
    responseFactor: PropTypes.number, // ratio for mouse dragging action - default 1
    text: PropTypes.string, // text displayed during dragging and hover
    doubleClickInit: PropTypes.bool, // if is present then double click set init value
}


export default KnobDescribed;