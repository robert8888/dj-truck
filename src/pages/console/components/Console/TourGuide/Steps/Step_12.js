import React, {useMemo, useRef} from "react";
import {Step} from "react-rtg";
import useEventDispatcher from "../utils/useEventDispatcher";

export default function useStep_12(){
    const dispatchEvent = useEventDispatcher();

    const wasApprovedByUser = useRef(false);

    return useMemo(() => (
        <Step
            key={"Step_12"}
            placement={"top-left"}
            selector={".channel-A .group-fx"}
            onBeforeNext={()=>{
                if(wasApprovedByUser.current) return;
                setTimeout(()=>dispatchEvent(
                    document.querySelector(".channel-A .btn-fx"),
                    [MouseEvent, "click"]
                ), 0)
            }}
            approve={{
                target: ".channel-A .btn-fx",
                callback: () =>{
                    wasApprovedByUser.current = true
                    return true;
                }
            }}
        >
            <p>
                You can choice from two build in effector channels.
            </p>
            <p>
                Both channels can be used at the same time
            </p>
        </Step>
    ), [wasApprovedByUser, dispatchEvent])
}
