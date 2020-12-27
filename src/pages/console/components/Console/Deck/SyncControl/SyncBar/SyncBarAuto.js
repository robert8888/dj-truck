import React from "react";
import {connect} from "react-redux"
import SyncBar from "./SyncBar";

const SyncBarAuto = ({noMaster, slave}) =>{
    return (
        <SyncBar className="sync-bar sync-bar-auto" active={!noMaster} name={ noMaster ? "idle" : slave}/>
    )
}

const mapStateToProps = (state) => ({
    slave : Object.keys(state.console.channel)?.find(channel => channel !== state.console.master),
    noMaster : (state.console.master === null || state.console.master === "")
})

export default connect(mapStateToProps)(SyncBarAuto);