import React from "react";
import {Button} from "react-bootstrap";
import withControlMapping from "../../Control/withControlMapping";


const OutButton = ({onClick}) =>{

    return (
        <Button className="btn--out" onClick={onClick}>OUT</Button>
    )
}

export default withControlMapping(OutButton);