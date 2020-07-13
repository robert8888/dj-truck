import React from "react";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPause, faPlay} from "@fortawesome/free-solid-svg-icons";
import withControlMapping from "../../Control/withControlMapping";

const PlayButton = ({onClick, paused}) =>{
    return (
        <Button className={"play-btn " + (((!paused) && "btn--pressed") || "")}
                onClick={onClick}>
            <FontAwesomeIcon icon={(paused) ? faPlay : faPause} />
        </Button>
    )
}

export default withControlMapping(PlayButton);