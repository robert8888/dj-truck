import React from "react";
import classNames from "classnames";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPause, faPlay} from "@fortawesome/free-solid-svg-icons";
import withControlMapping from "../../Control/withControlMapping";

const PlayButton = ({onClick, paused, channel}) =>{
    const classes = classNames(
        "btn--play", `btn--play--${channel}`, {
            "btn--pressed": !paused
        }
    )

    return (
        <Button className={classes}
                onClick={onClick}>
            <FontAwesomeIcon icon={(paused) ? faPlay : faPause} />
        </Button>
    )
}

export default withControlMapping(PlayButton);