import React, { useState, useEffect}from "react";
import { connect } from "react-redux";
import {MAPPING, setFader} from "actions";
import Slider from "./../../../common/RangeSlider/Slider";
import "./fader-slider.scss";
import generalStyle from "css/general.scss";
import withControlMapping from "../../Control/withControlMapping";

const Fader = props => {
    let [isZero , setIsZero ] = useState(true);
    const [, runUpdate] = useState(1);

    useEffect(()=>{
        const forceUpdate = () => runUpdate(Math.random());
        window.addEventListener('resize', forceUpdate);
        return () => {
            window.removeEventListener('resize', forceUpdate)
        }
    }, [])

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

    let orientation = {
        horizontal : true,
    };

    if(window.innerWidth < parseInt(generalStyle.verticalBreakPointExtraSmall))
    {
        delete orientation.horizontal;
        orientation.vertical = true;
    }

    return (
        <div className={"fader" + ((props.className) ? " " + props.className  : "") } >
            <div className={"zero-indicator " + ((isZero) ? "indicator--active" : "")}/>
            <Slider className="fader" 
                {...orientation}
                from={-50} 
                to={50} 
                step={5} 
                stickiZero={5}
                value={props.value}
                onChange={ sliderChangeHandle} />
        </div>
    )
}

const mapStateToProps = state => ({
    value : state.mixer.fader.current,
})

const mapDispatchToProps = dispatch => ({
    setFader : (value) => dispatch(setFader(value)),
})

const MixerFader = withControlMapping(connect(mapStateToProps, mapDispatchToProps)(Fader));

export default props => {
    return <MixerFader className="mixer-fader" onChange={props.setFader}  role={MAPPING.MIXER_FADER}/>
}


