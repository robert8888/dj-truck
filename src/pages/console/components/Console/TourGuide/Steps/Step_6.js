import React, {useMemo, useRef} from "react";
import {Step} from "react-rtg";
import useEventDispatcher from "../utils/useEventDispatcher";

export default function useStep_6(){
    const dispatchEvent = useEventDispatcher();
    const wasApprovedByAction = useRef(false)

    return useMemo(() => (
        <Step
            key={"Step_6"}
            placement={"top-left"}
            selector={".btn-dest.dest-a"}
            approve={{
                event: "click",
                callback: () =>{
                    wasApprovedByAction.current = true;
                    return true;
                }
            }}
            onBeforeNext={(state =>() =>{
                if(state.fired || wasApprovedByAction.current) return;
                state.fired = true;
                dispatchEvent(
                    document.querySelector(".btn-dest.dest-a"),
                    [MouseEvent, 'click']
                )
            })({fired: false})}
        >
            <p>
                Now you can choice deck player and load your track.
            </p>
        </Step>
    ), [wasApprovedByAction, dispatchEvent])
}
