import React from "react";
import {connect} from "react-redux"

const Loading = ({loadingProgress}) => {
    if(loadingProgress === 0 || loadingProgress === 100)
        return null;

    return (
        <div className="player__loading">
            <span>Loading {loadingProgress} % </span>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => ({
    loadingProgress : state.console.channel[ownProps.name].playBackState.loadingProgress,
});



export default connect(mapStateToProps)(Loading);