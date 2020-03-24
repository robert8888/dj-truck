import React from "react";
import "./track-info.scss";


import TrackDuration from "./TrackDuration/TrackDuration";
import TrackTitle from "./TrackTitle/TrackTitle";
import TimeLeft from "./TimeLeft/TimeLeft";
import Thumbnail from "./Thumbnail/Thumbnail";
import CurrentBpm from "./CurrentBpm/CurrentBpm";
import Pitch from "./Pitch/Pitch";
import Bpm from "./Bpm/Bpm";

const TrackInfo = props => {

 
    return (
        <div className={"track-info deck-" + props.name}>
            <Thumbnail name={props.name} />
            <div className="track-info-description">
                 <TrackTitle name={props.name}/>
            </div>
            <div className="track-info-time">
                <TimeLeft name={props.name}/>
                <TrackDuration name={props.name}/>
            </div>
            <div className="track-info-bpm">
                <CurrentBpm name={props.name}/>
                <Pitch name={props.name}/>
                <Bpm name={props.name}/>
            </div>
        </div>
    )
}




export default TrackInfo;