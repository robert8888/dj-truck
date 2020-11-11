import React, {useEffect, useMemo, useRef} from "react";
import {Step} from "react-rtg";
import useEventDispatcher from "../utils/useEventDispatcher";
import useRefSelector from "../../../../../common/Hooks/useRefSelector";

export default function useStep_14(){
    const dispatchEvent = useEventDispatcher()
    const stepFourteenResolver = useRef()

    const deckBReady = useRefSelector(state => state?.console.channel.B.playBackState.ready)

    useEffect((state => ()=>{
        if(state.fired || !deckBReady || !stepFourteenResolver.current) return;
        state.fired = true;
        stepFourteenResolver.current();
    })({fired: false}), [deckBReady])

    return useMemo(() => (
        <Step
            key={"Step_14"}
            placement={"top-left"}
            selector={".btn-dest.dest-b"}
            approve={{
                event: "click"
            }}
            onBeforeNext={(state =>() =>{
                if(state.fired) return;
                state.fired = true;
                dispatchEvent(
                    document.querySelector(".btn-dest.dest-b"),
                    [MouseEvent, 'click']
                )
            })({fired: false})}
        >
            <p>Let's load the second track</p>
        </Step>
    ), [dispatchEvent])
}
