

import React, { useRef, useEffect } from "react"
import { stripHtml } from "./../../../../../../../utils/html/htmlHelper";
import { connect } from "react-redux";


const TrackTitle = props => {
    const container = useRef(null);

    useEffect(()=>{
        container.current.textContent = (props.title) ? stripHtml(props.title) : "";
    }, [container, props.title])

    return (
        <span className="track-info-title" ref={container}/>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    title : state.console.channel[ownProps.name].track.title,
})

export default connect(mapsStateToProps)(TrackTitle);
