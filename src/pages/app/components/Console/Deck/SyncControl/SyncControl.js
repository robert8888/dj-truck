import React, { useCallback } from "react";
import { connect } from "react-redux";
import { Button } from 'react-bootstrap';
import { toggleSync, setMaster } from './../../../../../../actions';
import "./sync-control.scss";
import SyncBar from "./SyncBar/SyncBar";

const SyncControl = props =>{

    let isActive = useCallback(()=>{
        if(props.isMaster || props.noMaster){
            return false;
        } 
        return true;
    }, [props.isMaster, props.noMaster])

    return (
        <div className={"sync-control bar-deck-" + props.name }>
            <Button 
                className={"sync-btn " + ((props.syncState) ? "btn--pressed" : "")} 
                onClick={props.toggleSyncState}>
                    Sync
            </Button>
            <Button 
                className={"master-btn " + ((props.isMaster) ? "btn--pressed" : "" )}
                onClick ={props.toggleMasterState}>
                    Master
            </Button>
            <SyncBar className="sync-bar" active={ isActive} name={props.name}/>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => ({
    syncState : state.console.channel[ownProps.name].playBackState.sync,
    isMaster : state.console.master === ownProps.name,
    noMaster : (state.console.master === null || state.console.master === "")
})

const mapDispachToProps = (dispach, ownProps) => ({
    toggleSyncState : () => dispach(toggleSync(ownProps.name)),
    toggleMasterState : () => dispach(setMaster(ownProps.name))
})

export default connect(mapStateToProps, mapDispachToProps)(SyncControl);