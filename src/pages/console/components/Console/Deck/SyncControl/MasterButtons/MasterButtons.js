import React, {useContext} from "react";
import SyncButton from "./SyncButton";
import {MAPPING, setMaster, toggleSync} from "actions";
import MasterButton from "./MaterButton";
import LayoutContext from "../../../../../../common/Layout/LayoutContext";
import "./master-buttons.scss"


const MasterButtons = ({channel}) =>{
    const {mode, screen} = useContext(LayoutContext)

    return (
        <div className={`master-buttons master-buttons--${channel} master-buttons--${screen} master-buttons--${mode}`}>
            <MasterButton get={state => state.console.master === channel}
                          set={setMaster(channel, null)}
                          role={MAPPING[`DECK_CHANNEL_${channel}_MASTER`]}/>
            <SyncButton get={state => state.console.channel[channel].playBackState.sync}
                        set={toggleSync(channel, null)}
                        role={MAPPING[`DECK_CHANNEL_${channel}_SYNC`]}/>
        </div>
    )
}

export default MasterButtons