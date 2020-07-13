import React from "react";
import {Button} from "react-bootstrap";
import withControlMapping from "../../Control/withControlMapping";

const CueButton = ({onMouseDown, active}) =>{
    return (
        <Button
            className={"cue-btn " + ((active && "btn--pressed") || "")}
            onMouseDown={onMouseDown} >
            Cue
        </Button>
    )
}

export default  withControlMapping(CueButton);