import React from "react"
import { connect } from "react-redux";

const Pitch = ({pitch}) => {
    return (
        <span className="track-bpm-pitch">{pitch.toFixed(2)}</span>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    pitch :  state.console.channel[ownProps.name].playBackState.pitch.current,
})

export default connect(mapsStateToProps)(Pitch);
