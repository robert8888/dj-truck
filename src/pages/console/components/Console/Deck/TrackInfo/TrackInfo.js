import React from "react";
import "./track-info.scss";

import TrackDuration from "./TrackDuration/TrackDuration";
import TrackTitle from "./TrackTitle/TrackTitle";
import TimeLeft from "./TimeLeft/TimeLeft";
import Thumbnail from "./Thumbnail/Thumbnail";
import CurrentBpm from "./CurrentBpm/CurrentBpm";
import Pitch from "./Pitch/Pitch";
import Bpm from "./Bpm/Bpm";

const TrackInfo = ({name}) => {

    return (
        <div className={"track-info info-deck-" + name}>
            <Thumbnail name={name} />
            <div className="track-info-description">
                 {/*<TrackTitle name={name}/>*/}
            </div>
            <div className="track-info-time">
                <TimeLeft name={name}/>
                <TrackDuration name={name}/>
            </div>
            <div className="track-info-bpm">
                <CurrentBpm name={name}/>
                <Pitch name={name}/>
                <Bpm name={name}/>
            </div>
        </div>
    )
}


export default TrackInfo;