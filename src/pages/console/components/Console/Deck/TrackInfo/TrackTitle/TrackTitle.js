import React, { useRef, useEffect } from "react"
import { stripHtml } from "../../../../../../../utils/html/htmlHelper";
import { connect } from "react-redux";


const TrackTitle = ({title}) => {
    const container = useRef(null);

    useEffect(()=>{
        container.current.textContent = (title) ? stripHtml(title) : "";
    }, [container, title])

    return (
        <span className="track-info-title" ref={container}/>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    title : state.console.channel[ownProps.name].track.title,
})

export default connect(mapsStateToProps)(TrackTitle);
