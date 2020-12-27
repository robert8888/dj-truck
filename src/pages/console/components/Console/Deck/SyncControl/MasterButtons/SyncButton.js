import React from "react";
import {Button} from "react-bootstrap";
import withControlMapping from "../../../Control/withControlMapping";
import {connect} from "react-redux";


const SyncButton = ({update, state}) => {
    return (
        <Button
            className={"sync-btn " + ((state) ? "btn--pressed" : "")}
            onClick={update}>
            Sync
        </Button>
    )
}

const mapStateToProps = (state, {get}) => ({
    state : get(state),
})

const mapDispatchToProps = (dispatch, {set}) => ({
    update: () => dispatch(set)
})

export default withControlMapping(connect(mapStateToProps, mapDispatchToProps)(SyncButton));