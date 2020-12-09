import React from "react";
import {connect} from "react-redux"

const Loading = ({loadingProgress, processing}) => {
    if((loadingProgress === 0 || loadingProgress === 100) && !processing)
        return null;

    const content = loadingProgress !== 0 && loadingProgress !== 100 ?
        `Loading ${loadingProgress} % ` : `Processing`;

    return (
        <div className="player__loading">
            <span>{content}</span>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => ({
    loadingProgress : state.console.channel[ownProps.name].playBackState.loadingProgress,
    processing: state.console.channel[ownProps.name].playBackState.processing,
});



export default connect(mapStateToProps)(Loading);