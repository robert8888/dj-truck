import React, { useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { togglePlay, toggleCue, canelCueAndPlay } from "./../../../../../../actions";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import "./play-back.scss";

const PlayBackControls = ({ name, toggleCue, togglePalay, cuePlay, paused, cueActive }) => {

    const cueMouseDown = () => {
        toggleCue()
        document.addEventListener('mouseup', mouseUp)
    }

    const mouseUp = (event) => {
        document.elementFromPoint(event.clientX, event.clientY)
        const buttonUnderMouse = document.elementFromPoint(event.clientX, event.clientY).closest('button')
        if (buttonUnderMouse) {
            if (buttonUnderMouse.closest('div').classList.contains("play-back-controls-" + name)
                && buttonUnderMouse.classList.contains('btn-play')) {
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
        <div className={"play-back-controls-" + name}>
            <Button className={"play-btn " + (((!paused) && "btn--pressed") || "")}
                onClick={togglePalay}>
                <FontAwesomeIcon icon={(paused) ? faPlay : faPause} />
            </Button>
            <Button
                className={"cue-btn " + ((cueActive && "btn--pressed") || "")}
                onMouseDown={cueMouseDown} >
                Cue
            </Button>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => ({
    paused: state.console.channel[ownProps.name].playBackState.paused,
    cueActive: state.console.channel[ownProps.name].playBackState.cueActive,
})

const mapDispachToProps = (dispach, ownProps) => ({
    togglePalay: () => dispach(togglePlay(ownProps.name)),
    toggleCue: () => dispach(toggleCue(ownProps.name)),
    cuePlay: () => dispach(canelCueAndPlay(ownProps.name))
})

export default connect(mapStateToProps, mapDispachToProps)(PlayBackControls);

