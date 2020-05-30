import React from "react";
import PlaybackButton from "../../../PlaybackButton/PlaybackButton";
import { stripHtml } from "./../../../../../../utils/html/htmlHelper";
import { formater } from "./../../../../../../utils/time/timeFromater";

const SearchListItem = (props) => {

    const {
        title,
        description,
        sourceId,
        thumbnails,
        duration,
        source,
        sourceUrl,
    } = props.item;
    
    const formatTime = time => {
        if(!time) return null;

        if(typeof time === "number"){
            return formater.secondsToStr(time);
        } else if(typeof time === "string" && time.startsWith("PT")){
            return time.substr(2, time.length).toLowerCase()
        }
    }

    const handleClick = () => {
        const track = {
            ...props.item,
        }
        if (track.source === "YouTube" && typeof track.duration === "string") {
            track.duration = formater.ptToSeconds(track.duration);
        }
        props.addToListHandle(track);
        props.closeListHandle();
    }

    return (
        <li className="search-list-item" onClick={handleClick}>
            <div className="list-item-thumbnails">
                <img alt="youtube thumbnail" className="thumbnail-img" src={thumbnails?.default?.url} />
                <span className="thumbnail-time">{formatTime(duration)}</span>
                { props.player && 
                    <PlaybackButton 
                        className="search-result"
                        playback={props.playback} 
                        player={props.player}
                        id={sourceId} 
                        source={source}/>
                }
            </div>
            <div className="list-item-details">
                <h5>{stripHtml(title)}</h5>
                <p>{stripHtml(description)}</p>
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}> {sourceUrl} </a>
            </div>
        </li>
    )
}

export default SearchListItem