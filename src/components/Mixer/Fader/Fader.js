import React, { useState }from "react";
import { connect } from "react-redux";
import { setFader } from "../../../actions";
import Slider from "./../../common/Slider/Slider";
import "./fader-slider.scss";

const Fader = props => {
    let [isZero , setIsZero ] = useState(true);

    const sliderChangeHandle = (value, isTemp) =>{
        let isZero = false;
        if(value > -4.5 && value < 4.5){
            isZero = true;
        } 
        setIsZero(isZero);

        if(!isTemp){
            if(isZero){
                value = 0;
            }
            props.setFader(value);
        }
    }

    return (
        <div className={"fader" + ((props.className) ? " " + props.className  : "") } >
            <div className={"zero-indicator " + ((isZero) ? "indicator--active" : "")}/>
            <Slider className="fader" 
                horizontal 
                from={-50} 
                to={50} 
                step={5} 
                stickiZero={5}
                onChange={ sliderChangeHandle } />
        </div>
    )
}


const mapDispachToProps = dispatch => ({
    setFader : (value) => dispatch(setFader(value)), 
})

export default connect(null, mapDispachToProps)(Fader);
