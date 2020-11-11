import React, {useMemo, useRef} from "react";
import {Step} from "react-rtg";
import useEventDispatcher from "../utils/useEventDispatcher";

export default function useStep_16(){
    const dispatchEvent = useEventDispatcher();
    const wasApprovedByUserAction = useRef(false);

    return useMemo(() => (
        <Step
            key={"Step_16"}
            placement={"bottom-left"}
            selector={".sync-control--B  .sync-btn"}
            onBeforeNext={() => {
                if(wasApprovedByUserAction.current) return;
                dispatchEvent(
                    document.querySelector(".sync-control--B  .sync-btn"),
                    [MouseEvent, "click"]
                )
            }}
            approve={{
                event: "click",
                callback: ()=>{
                    wasApprovedByUserAction.current = true;
                    return true;
                }
            }}
        >
            <p>
                You can adjust tempo and make beatmatching 'manually' but
                for now we will use automatic synchronization
            </p>
        </Step>
    ), [wasApprovedByUserAction, dispatchEvent])
}
