import React from "react";
import {Button} from "react-bootstrap";
import withControlMapping from "../../Control/withControlMapping";

const CueButton = ({onMouseDown, active}) =>{
    return (
        <Button
            className={"btn--cue " + ((active && "btn--pressed") || "")}
            onMouseDown={onMouseDown} >
            Cue
        </Button>
    )
}

export default  withControlMapping(CueButton);