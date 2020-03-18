import React from "react";
import { connect } from "react-redux"; 
import { togglePlay , toggleCue , canelCueAndPlay } from "./../../../actions";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay , faPause } from '@fortawesome/free-solid-svg-icons';
import "./play-back.scss";

const PlayBackControls = props => {

    const cueMouseDown = () =>{
        props.onCueToggle()
        document.addEventListener('mouseup', mouseUp)
    }

    const mouseUp = (event) =>{
        document.elementFromPoint(event.clientX, event.clientY)
        const buttonUnderMouse = document.elementFromPoint(event.clientX, event.clientY).closest('button')
        if(buttonUnderMouse){
            if(buttonUnderMouse.closest('div').classList.contains("play-back-controls-" + props.name) 
            && buttonUnderMouse.classList.contains('btn-play')){
                props.cancelCueAndPlay();
            } else {
                props.onCueToggle()
            }
        } else {
            props.onCueToggle()
        }
        document.removeEventListener('mouseup', mouseUp);
    }
    
    return (
        <div className={"play-back-controls-" + props.name }>
            <Button className={"btn-play " + (((!props.playPressed) && "btn--pressed" ) || "" ) }
                onClick={  props.onPlayPress }>
                    <FontAwesomeIcon icon={(props.playPressed) ? faPlay : faPause}/>
            </Button>
            <Button 
               className={"btn-cue " + ((props.cuePressed && "btn--pressed") || "") }
                onMouseDown={ cueMouseDown } > 
                    Cue 
            </Button>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => ({
    playPressed : state.console.channel[ownProps.name].playBackState.paused,
    cuePressed : state.console.channel[ownProps.name].playBackState.cueActive,
})

const mapDispachToProps = (dispach, ownProps) => ({
    onPlayPress : () => dispach(togglePlay(ownProps.name)),
    onCueToggle : () => dispach(toggleCue(ownProps.name)),
    cancelCueAndPlay : () => dispach(canelCueAndPlay(ownProps.name))
})

export default connect(mapStateToProps, mapDispachToProps)(PlayBackControls);

