import React, { useRef, useEffect } from "react"
import { connect } from "react-redux";

const Thumbnail = props => {
    const container = useRef(null);

    useEffect(()=>{
        if(props.thumbnailURL){
            container.current.src = props.thumbnailURL;
        }

    }, [ container, props.thumbnailURL])

    return (
        <div className="track-info-thumbnail">
            {(props.thumbnailURL && <img alt="track thumbnails" ref={container}/>)}
        </div>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    thumbnailURL : state.console.channel[ownProps.name]?.track?.thumbnails?.default?.url,
})

export default connect(mapsStateToProps)(Thumbnail);


