import React from "react";
import {Button} from "react-bootstrap";
import withControlMapping from "../../../Control/withControlMapping";
import {connect} from "react-redux";

const MasterButton = ({update, state}) => {
    return (
        <Button
            className={"master-btn " + ((state) ? "btn--pressed" : "" )}
            onClick ={update}>
            Master
        </Button>
    )
}

const mapStateToProps = (state, {get}) => ({
    state: get(state),
})

const mapDispatchToProps = (dispatch, {set}) => ({
    update: () => dispatch(set),
})

export default withControlMapping(connect(mapStateToProps, mapDispatchToProps)(MasterButton));