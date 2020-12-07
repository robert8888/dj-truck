import React from "react"
import { stripHtml } from "utils/html/htmlHelper";
import { connect } from "react-redux";


const TrackTitle = ({title}) => {
    return (
        <span className="track-info-title" >{stripHtml(title)}</span>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    title : state.console.channel[ownProps.name].track.title,
})

export default connect(mapsStateToProps)(TrackTitle);
