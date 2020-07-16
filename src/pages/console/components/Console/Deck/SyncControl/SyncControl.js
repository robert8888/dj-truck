import React, {useCallback, useContext} from "react";
import { connect } from "react-redux";
import {toggleSync, setMaster, MAPPING} from './../../../../../../actions';
import SyncBar from "./SyncBar/SyncBar";
import SyncButton from "./SyncButton";
import MasterButton from "./MaterButton";
// import ConsoleContext from "./../../ConsoleCtx";
// import DeckContext from "./../DeckCtx";
import "./sync-control.scss";

const SyncControl = ({isMaster, noMaster, channel}) => {
    // const consoleContext = useContext(ConsoleContext);
    // const deckContext = useContext(DeckContext);

    let isActive = useCallback(()=>{
        if(isMaster || noMaster){
            return false;
        } 
        return true;
    }, [isMaster, noMaster])

    return (

        <div className={"sync-control sync-control--" + channel}>
            <SyncButton get={state => state.console.channel[channel].playBackState.sync}
                        set={toggleSync(channel, null)}
                        role={MAPPING[`DECK_CHANNEL_${channel}_SYNC`]}/>
            <MasterButton get={state => state.console.master === channel}
                          set={setMaster(channel, null)}
                          role={MAPPING[`DECK_CHANNEL_${channel}_MASTER`]}/>
            <SyncBar className="sync-bar" active={ isActive} name={channel}/>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => ({
    isMaster : state.console.master === ownProps.name,
    noMaster : (state.console.master === null || state.console.master === "")
})

export default connect(mapStateToProps)(SyncControl);