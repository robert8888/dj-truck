import React, { useRef, useEffect } from "react"
import { connect } from "react-redux";

const Thumbnail = ({thumbnailURL}) => {
    const container = useRef(null);

    useEffect(()=>{
        if(thumbnailURL){
            container.current.src = thumbnailURL;
        }

    }, [ container, thumbnailURL])

    return (
        <div className="track-info-thumbnail">
            {(thumbnailURL && <img alt="track thumbnails" ref={container}/>)}
        </div>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    thumbnailURL : state.console.channel[ownProps.name]?.track?.thumbnails?.default?.url,
})

export default connect(mapsStateToProps)(Thumbnail);


