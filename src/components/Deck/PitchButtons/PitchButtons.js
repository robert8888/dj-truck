import React from "react"
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import {increaseBpm, decreaseBpm} from "./../../../actions/actions";
import "./pitch-buttons.scss"

const PitchButtons = props =>{

    
    return (
        <div className={"pitch-btns-" + props.name}>
            <Button className="pitch-btn btn-increase" onClick={ props.increaseBpm.bind(null, 1) }> + </Button>
            <Button className="pitch-btn btn-decrease" onClick={ props.decreaseBpm.bind(null, 0.05) }> - </Button>
        </div>
    )
}

const mapDispachToProps = (dispatch, ownProps) =>({
    increaseBpm : (amount) => dispatch(increaseBpm(ownProps.name, amount)),
    decreaseBpm : (amount) => dispatch(decreaseBpm(ownProps.name, amount)),  
})

export default connect(null, mapDispachToProps)(PitchButtons);