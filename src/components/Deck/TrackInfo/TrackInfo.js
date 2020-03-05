import React, { useMemo } from "react";
import { connect } from "react-redux";
import "./track-info.scss";
import track_thumbnail from "./../../../assets/img/track_thumbnail.png";

import { calcBpm } from "./../../../utils/bpm/converter.js";
import { stripHtml } from "./../../../utils/html/htmlHelper.js";
import { formater } from "./../../../utils/time/timeFromater"

const TrackInfo = props => {
    let track = useMemo(()=>({
        ...props.track
    }), [props.track]);

    return (
        <div className={"track-info deck-" + props.name}>
            <div className="track-info-thumbnail">
                <img 
                alt="track thumbnails"
                src={track.details.thumbnail?.default?.url || track_thumbnail}></img>
            </div>
            <div className="track-info-description">
                <span className="track-info-title">
                    { stripHtml(track.details.title) }
                </span>
            </div>
            <div className="track-info-time">
                <span className="time-left">
                    { ((track.state.timeLeft) ? formater.secondsToStr(track.state.timeLeft) : formater.ytToStr(track.details.duration)) }
                </span>
                <span className="track-duration">
                    { formater.ytToStr(track.details.duration) }
                </span>
            </div>
            <div className="track-info-bpm">
                <span className="track-bpm-current">
                    { track.details.bpm && calcBpm(track.details.bpm, track.state.pitch).toFixed(2) }
                </span>
                <span className="tarck-bpm-pitch">
                    { track.state.pitch.toFixed(2) + "%"}
                </span>
                <span className="track-bpm-init">
                    { track.details.bpm && track.details.bpm.toFixed(2) }
                </span>
            </div>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => ({
    track : {
        details : state.console.channel[ownProps.name].track,
        state : state.console.channel[ownProps.name].playBackState,
    }
})



export default connect(mapStateToProps)(TrackInfo);