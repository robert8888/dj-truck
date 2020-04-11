import React, { useRef, useEffect } from "react"
import { formater } from "./../../../../../../../utils/time/timeFromater";
import { connect } from "react-redux";


const TrackDuration = props => {
    const container = useRef(null);

    useEffect(()=>{
        if(typeof props.trackDuration === "string"){
            container.current.textContent = formater.ptToStr(props.trackDuration);
        } else {
            container.current.textContent = formater.secondsToStr(props.trackDuration);
        }

    }, [ container, props.trackDuration])

    return (
        <span className="track-duration" ref={container}/>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    trackDuration : state.console.channel[ownProps.name].track.duration,
})

export default connect(mapsStateToProps)(TrackDuration);