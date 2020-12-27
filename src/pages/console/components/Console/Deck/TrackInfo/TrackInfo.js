import React from "react";
import TrackDuration from "./TrackDuration/TrackDuration";
import TrackTitle from "./TrackTitle/TrackTitle";
import TimeLeft from "./TimeLeft/TimeLeft";
import Thumbnail from "./Thumbnail/Thumbnail";
import CurrentBpm from "./CurrentBpm/CurrentBpm";
import Pitch from "./Pitch/Pitch";
import Bpm from "./Bpm/Bpm";
import DeckName from "./DeckName/DeckName";

import "./track-info.scss";
const TrackInfo = ({channel, mode}) => {

    return (
        <div className={`track-info info-deck-${channel} track-info--${mode}`}>
            {mode === "desktop" ? <Thumbnail name={channel} /> : <DeckName channel={channel} />}
            <div className="track-info-description">
                 <TrackTitle name={channel}/>
            </div>
            <div className="track-info-time">
                <TimeLeft name={channel}/>
                {mode === "desktop"  && <TrackDuration name={channel}/>}
            </div>
            <div className="track-info-bpm">
                <CurrentBpm channel={channel}/>
                {mode === "desktop"  && <Pitch name={channel}/>}
                {mode === "desktop"  && <Bpm name={channel}/>}
            </div>
        </div>
    )
}


export default TrackInfo;