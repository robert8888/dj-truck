import React, {useMemo} from "react";
import {Step} from "react-rtg";
import useRefSelector from "../../../../../common/Hooks/useRefSelector";
import {togglePlay as deckPlayAction} from "../../../../../../actions";
import {useDispatch} from "react-redux";

export default function useStep_15(){
    const dispatch = useDispatch()
    const deckBPaused  = useRefSelector(state => state?.console.channel.B.playBackState.paused)
    const deckBReady = useRefSelector(state => state?.console.channel.B.playBackState.ready)

    return useMemo(() => (
        <Step
            key={"Step_15"}
            placement={"top-left"}
            selector={".controls__playback--B .btn--play"}
            onBeforeNext={() =>{
                if(!deckBReady.current) return false;
                setTimeout(() => {
                if(deckBPaused.current)
                    dispatch(deckPlayAction("B", true))
                }, 0)
                return true;
            }}
            approve={{
                event: "click",
                target: ".controls__playback--B .btn--play",
                callback: () => {
                    console.log("is b redy", deckBReady.current)
                    return deckBReady.current
                }
            }}
        >
            <p>
                You have play, and cue button. If you push cue and then you will
                release it over play button then track will continue playing
            </p>
            <p>
                Push play
            </p>
        </Step>
    ), [deckBPaused, dispatch])
}
