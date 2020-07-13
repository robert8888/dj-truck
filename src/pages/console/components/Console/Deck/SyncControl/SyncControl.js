import React, { useCallback } from "react";
import { connect } from "react-redux";
import {toggleSync, setMaster, MAPPING} from './../../../../../../actions';
import "./sync-control.scss";
import SyncBar from "./SyncBar/SyncBar";
import SyncButton from "./SyncButton";
import MasterButton from "./MaterButton";

const SyncControl = ({isMaster, noMaster, name}) => {

    let isActive = useCallback(()=>{
        if(isMaster || noMaster){
            return false;
        } 
        return true;
    }, [isMaster, noMaster])

    return (

        <div className={"sync-control bar-deck-" + name }>
            <SyncButton get={state => state.console.channel[name].playBackState.sync}
                        set={toggleSync(name, null)}
                        role={MAPPING[`DECK_CHANNEL_${name}_SYNC`]}/>
            <MasterButton get={state => state.console.master === name}
                          set={setMaster(name, null)}
                          role={MAPPING[`DECK_CHANNEL_${name}_MASTER`]}/>
            <SyncBar className="sync-bar" active={ isActive} name={name}/>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => ({
    isMaster : state.console.master === ownProps.name,
    noMaster : (state.console.master === null || state.console.master === "")
})

export default connect(mapStateToProps)(SyncControl);