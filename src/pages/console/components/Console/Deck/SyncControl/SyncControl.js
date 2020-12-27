import React, { useMemo, useState} from "react";
import { connect } from "react-redux";
import SyncBar from "./SyncBar/SyncBar";
import BeatShiftButtons from "./BeatShiftButtons/BeatShiftButtons";
import MasterButtons from "./MasterButtons/MasterButtons";
import "./sync-control.scss";

const SyncControl = ({isMaster, noMaster, channel}) => {

    let isActive = useMemo(()=>{
        return !(isMaster || noMaster);
    }, [isMaster, noMaster])

    const [beatPosition, setBeatPosition] = useState(null);

    return (
        <div className={"sync-control sync-control--" + channel}>
            <MasterButtons channel={channel}/>
            <div className={"sync-control__group"}>
                <SyncBar className="sync-bar" active={isActive} name={channel} updateBeatPosition={setBeatPosition}/>
                <BeatShiftButtons channel={channel} beatPosition={beatPosition} active={isActive}/>
            </div>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => ({
    isMaster : state.console.master === ownProps.channel,
    noMaster : (state.console.master === null || state.console.master === "")
})

export default connect(mapStateToProps)(SyncControl);