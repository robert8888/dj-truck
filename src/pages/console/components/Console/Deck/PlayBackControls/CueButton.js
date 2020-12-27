import React from "react";
import withControlMapping from "../../Control/withControlMapping";
import HoldButton from "pages/common/components/HoldButton/HoldButton";

const CueButton = ({onHold, onRelease, active}) =>{
    return (
        <HoldButton
            className={"btn--cue btn btn-primary " + ((active && " btn--pressed-filed ") || "")}
            onHold={onHold}
            onRelease={onRelease}>
            Cue
        </HoldButton>
    )
}

export default  withControlMapping(CueButton);