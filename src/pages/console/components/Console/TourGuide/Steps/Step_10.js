import React, {useMemo} from "react";
import {Step} from "react-rtg";
import useEventDispatcher from "../utils/useEventDispatcher";

export default function useStep_10(){
    const dispatchEvent = useEventDispatcher();

    return useMemo(() => (
        <Step
            key={"Step_10"}
            placement={"right"}
            selector={".sync-control--A  .master-btn"}
            approve={{event: "click"}}
            onBeforeNext={(state => () =>{
                if(state.fired) return;
                state.fired = true;
                const target = document.querySelector(".sync-control--A  .master-btn")
                if(target.classList.contains("btt--pressed")) return;
                dispatchEvent(
                    target,
                    [MouseEvent, "click"]
                )
            })({fired:false})}
        >
            <p>
                Mark this track as master
            </p>
            <p>
                Master is a track to witch will be sync second one by press sync button
            </p>
        </Step>
    ), [dispatchEvent])
}
