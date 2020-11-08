
import React from "react";
import { connect } from "react-redux";
import {canelCueAndPlay, MAPPING, toggleCue, togglePlay}
    from "../../../../../../actions";
import PlayButton from "./PlayButton";
import CueButton from "./CueButton";
import "./play-back.scss";


const PlayBackControls = ({ name, toggleCue, togglePlay, cuePlay, paused, cueActive }) => {

    const cueMouseDown = () => {
        toggleCue()
        document.addEventListener('mouseup', mouseUp)
    }

    const mouseUp = (event) => {
        const buttonUnderMouse = document.elementFromPoint(event.clientX, event.clientY).closest('button')
        if (buttonUnderMouse) {
            if (buttonUnderMouse.closest('div').classList.contains("controls__playback--" + name)
                && buttonUnderMouse.classList.contains('btn--play')) {
                cuePlay();
            } else {
                toggleCue()
            }
        } else {
            toggleCue()
        }
        document.removeEventListener('mouseup', mouseUp);
    }

    return (
        <div className={"controls__playback controls__playback--" + name}>
            <PlayButton onClick={togglePlay}
                        paused={paused}
                        role={MAPPING[`DECK_CHANNEL_${name}_PLAY`]}/>
            <CueButton  onMouseDown={cueMouseDown}
                        active={cueActive}
                        role={MAPPING[`DECK_CHANNEL_${name}_CUE`]}/>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => ({
    paused: state.console.channel[ownProps.name].playBackState.paused,
    cueActive: state.console.channel[ownProps.name].playBackState.cueActive,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    togglePlay: () => dispatch(togglePlay(ownProps.name, null)),
    toggleCue: () => dispatch(toggleCue(ownProps.name, null)),
    cuePlay: () => dispatch(canelCueAndPlay(ownProps.name, null))
})

export default connect(mapStateToProps, mapDispatchToProps)(PlayBackControls);

