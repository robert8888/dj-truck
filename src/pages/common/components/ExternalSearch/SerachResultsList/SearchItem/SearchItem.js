import React, {useContext} from "react";
import PlaybackButton from "pages/common/components/PlaybackButton/PlaybackButton";
import Img from "react-img-fallbacks"
import { stripHtml } from "utils/html/htmlHelper";
import { formater } from "utils/time/timeFromater";
import LayoutContext from "pages/common/Layout/LayoutContext";


const SearchListItem = (props) => {
    const {mode} = useContext(LayoutContext);

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
        <li className={`search-results__item search-results__item--${mode}`} onClick={handleClick}>
            <div className="search-results__item__thumbnail">
                <Img alt={"thumbnail -" + stripHtml(title)}
                     className="thumbnail-img"
                     src={[thumbnails?.default?.url, "/music_source_thumbnail.png"]}/>
                <span className="search-results__item__time">{formatTime(duration)}</span>
                { props.player && 
                    <PlaybackButton 
                        className="search-results"
                        playback={props.playback} 
                        player={props.player}
                        id={sourceId} 
                        source={source}/>
                }
            </div>
            <div className="search-results__item__details">
                <h5 className={"search-results__item__title"}>{stripHtml(title)}</h5>
                <p className={"search-results__item__subtitle"}>{stripHtml(description)}</p>
                <a className={"search-results__item__link"}
                   href={sourceUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   onClick={e => e.stopPropagation()}>
                    {sourceUrl}
                </a>
            </div>
        </li>
    )
}

export default SearchListItem