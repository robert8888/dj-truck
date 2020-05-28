import React from "react";
import { getApi } from "./../../../../../../apis/apiProvider";
import { stripHtml } from "./../../../../../../utils/html/htmlHelper";
import { formater } from "./../../../../../../utils/time/timeFromater";

const SearchListItem = (props) => {

    const {
        title,
        description,
        sourceId: id,
        thumbnails,
        duration,
        source
    } = props.item;

    const api = getApi(source);

    const sourceUrl = api.getUrlToExternall(id);

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
            //_id: UUID.genV1().toString(),
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
            </div>
            <div className="list-item-details">
                <h5>{stripHtml(title)}</h5>
                <p>{stripHtml(description)}</p>
                <a href={sourceUrl}> {sourceUrl} </a>
            </div>
        </li>
    )
}

export default SearchListItem