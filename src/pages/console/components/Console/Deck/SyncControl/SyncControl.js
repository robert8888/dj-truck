import React, { useMemo, useState} from "react";
import { connect } from "react-redux";
import {toggleSync, setMaster, MAPPING} from 'actions';
import SyncBar from "./SyncBar/SyncBar";
import SyncButton from "./SyncButton";
import MasterButton from "./MaterButton";
import "./sync-control.scss";
import BeatOffsetButton from "./BeatOffsetButton/BeatOffsetButton";
import BeatShiftButtons from "./BeatShiftButtons/BeatShiftButtons";

const SyncControl = ({isMaster, noMaster, channel}) => {

    let isActive = useMemo(()=>{
        return !(isMaster || noMaster);
    }, [isMaster, noMaster])

    const [beatPosition, setBeatPosition] = useState(null);

    return (
        <div className={"sync-control sync-control--" + channel}>
            <SyncButton get={state => state.console.channel[channel].playBackState.sync}
                        set={toggleSync(channel, null)}
                        role={MAPPING[`DECK_CHANNEL_${channel}_SYNC`]}/>
            <MasterButton get={state => state.console.master === channel}
                          set={setMaster(channel, null)}
                          role={MAPPING[`DECK_CHANNEL_${channel}_MASTER`]}/>
            <div className={"sync-control__group"}>
                <SyncBar className="sync-bar" active={isActive} name={channel} updateBeatPosition={setBeatPosition}/>
                <BeatShiftButtons channel={channel} beatPosition={beatPosition} active={isActive}/>
            </div>
            <BeatOffsetButton/>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => ({
    isMaster : state.console.master === ownProps.channel,
    noMaster : (state.console.master === null || state.console.master === "")
})

export default connect(mapStateToProps)(SyncControl);