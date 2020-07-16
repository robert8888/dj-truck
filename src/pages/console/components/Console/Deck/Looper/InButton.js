import React from "react";
import {Button} from "react-bootstrap";
import withControlMapping from "../../Control/withControlMapping";


const InButton = ({onClick, state}) =>{

    return (
        <Button className={"btn--in" + ((state) ? " btn--pressed-filed" : "")}
                onClick={onClick}>
            IN
        </Button>
    )
}

export default withControlMapping(InButton);