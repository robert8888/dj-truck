import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBackward, faForward} from "@fortawesome/free-solid-svg-icons";
import {MAPPING, setPitch} from "actions";
import "./beat-shift-buttons.scss";
import ShiftButton from "./ShiftButton";
import classNames from "classnames"


const BeatShiftButtons = ({channel, active, beatPosition}) =>{
    return (
        <div className={"beat-shift"}>
            <ShiftButton className={classNames(
                  "beat-shift__btn beat-shift__btn--backward",
                         {" beat-shift__btn--active": beatPosition === "ahead" && active}
                         )}
                         direction={"backward"}
                         get={state => state.console.channel[channel].playBackState.pitch.current}
                         set={setPitch.bind(null, channel)}
                         role={MAPPING[`DECK_CHANNEL_${channel}_FORWARD`]}>
                <FontAwesomeIcon icon={faBackward}/>
            </ShiftButton>

            <ShiftButton className={classNames(
                  "beat-shift__btn beat-shift__btn--forward",
                         {" beat-shift__btn--active": beatPosition === "delayed" && active}
                         )}
                         direction={"forward"}
                         get={state => state.console.channel[channel].playBackState.pitch.current}
                         set={setPitch.bind(null, channel)}
                         role={MAPPING[`DECK_CHANNEL_${channel}_BACKWARD`]}>
                <FontAwesomeIcon icon={faForward}/>
            </ShiftButton>
        </div>
    )
}



export default BeatShiftButtons;