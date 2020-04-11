import React, { useRef, useEffect } from "react"
import { formater } from "./../../../../../../../utils/time/timeFromater";
import { connect } from "react-redux";


const TimeLeft = props => {
    const container = useRef(null);

    useEffect(()=>{
        let timeLeft;
        if(props.timeLeft){
            timeLeft = formater.secondsToStr(props.timeLeft);
        } else {
            if(typeof props.trackDuration === "string"){
                timeLeft = formater.ptToStr(props.trackDuration);
            } else {
                timeLeft = formater.secondsToStr(props.trackDuration);
            }
        }
        container.current.textContent = timeLeft;
    }, [props.timeLeft, container, props.trackDuration])

    return (
        <span className="time-left" ref={container}/>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    trackDuration : state.console.channel[ownProps.name].track.duration,
    timeLeft :  state.console.channel[ownProps.name].playBackState.timeLeft,
})

export default connect(mapsStateToProps)(TimeLeft);