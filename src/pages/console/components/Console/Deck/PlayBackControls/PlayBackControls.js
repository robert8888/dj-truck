import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { canelCueAndPlay, toggleCue, togglePlay } from "./../../../../../../actions";
import "./play-back.scss";

const PlayBackControls = ({ name, toggleCue, togglePalay, cuePlay, paused, cueActive }) => {

    const cueMouseDown = () => {
        toggleCue()
        document.addEventListener('mouseup', mouseUp)
    }

    const mouseUp = (event) => {
        document.elementFromPoint(event.clientX, event.clientY)
        const buttonUnderMouse = document.elementFromPoint(event.clientX, event.clientY).closest('button')
        console.log(buttonUnderMouse)
        if (buttonUnderMouse) {
            if (buttonUnderMouse.closest('div').classList.contains("play-back-controls-" + name)
                && buttonUnderMouse.classList.contains('play-btn')) {
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

