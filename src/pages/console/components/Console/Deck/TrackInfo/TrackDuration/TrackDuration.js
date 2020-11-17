import React, { useMemo } from "react"
import { formater } from "../../../../../../../utils/time/timeFromater";
import { connect } from "react-redux";


const TrackDuration = ({duration, pitch}) => {
    const value = useMemo(()=>{
        let seconds = duration;
        if(typeof duration === "string"){
            seconds = formater.ptToSeconds(duration);
        }

        return formater.secondsToStr(seconds / (1 + pitch / 100));
    }, [duration, pitch])

    return (
        <span className="track-duration">{value}</span>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    duration : state.console.channel[ownProps.name].track.duration,
    pitch: state.console.channel[ownProps.name].playBackState.pitch.current,
})

export default connect(mapsStateToProps)(TrackDuration);