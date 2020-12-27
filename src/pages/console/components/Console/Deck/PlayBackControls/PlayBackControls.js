import React from "react";
import { connect } from "react-redux";
import {canelCueAndPlay, MAPPING, toggleCue, togglePlay} from "actions";
import PlayButton from "./PlayButton";
import CueButton from "./CueButton";
import "./play-back.scss";

const PlayBackControls = ({ name, toggleCue, togglePlay, cuePlay, paused, cueActive }) => {


    const cueRelease = e => {
        let target;
        if(e.changedTouches?.length){
            const {clientX: x, clientY: y} = e.changedTouches[0]
            target = document.elementFromPoint(x, y);
        } else {
            target = e.target;
        }

        if(target.closest(`.btn--play--${name}`)){
            cuePlay()
        } else {
            toggleCue()
        }
    }

    return (
        <div className={"controls__playback controls__playback--" + name}>
            <PlayButton channel={name}
                        onClick={togglePlay}
                        paused={paused}
                        role={MAPPING[`DECK_CHANNEL_${name}_PLAY`]}/>
            <CueButton  //onMouseDown={cueMouseDown}
                        onHold={toggleCue}
                        onRelease={cueRelease}
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

