import React, { Fragment } from "react";
import { connect } from "react-redux";
import "./track-info.scss";
import track_thumbnail from "./../../../assets/img/track_thumbnail.png";

import { calcBpm } from "./../../../utils/bpm/converter.js";
import { stripHtml } from "./../../../utils/html/htmlHelper.js";
import { formater } from "./../../../utils/time/timeFromater"

const TrackInfo = props => {
    const track = props.track;
    
    let title = stripHtml(track.details.title);
    let seprator = title.indexOf("-");
    if(seprator !== -1){
        title = (<Fragment><span>{title.substr(0, seprator)}</span> {title.substr(seprator, title.length)}</Fragment>);

    }
 
    return (
        <div className={"track-info deck-" + props.name}>
            <div className="track-info-thumbnail">
                <img 
                alt="track thumbnails"
                src={track.details.thumbnail?.default?.url || track_thumbnail}></img>
            </div>
            <div className="track-info-description">
                <p className="track-info-title">
                    { title }
                </p>
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