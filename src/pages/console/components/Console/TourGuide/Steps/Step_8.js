import React, {useMemo} from "react";
import {Step} from "react-rtg";
import {togglePlay as deckPlayAction} from "../../../../../../actions";
import useRefSelector from "../../../../../common/Hooks/useRefSelector";
import {useDispatch} from "react-redux";

export default function useStep_8(){
    const dispatch = useDispatch()
    const deckAPaused = useRefSelector(state => state?.console.channel.A.playBackState.paused)

    return useMemo(() => (
        <Step
            key={"Step_8"}
            placement={"top-right"}
            selector={".controls__playback--A .btn--play"}
            onBeforeNext={() => setTimeout(() => {
                if(deckAPaused.current)
                    dispatch(deckPlayAction("A", true));
            }, 0)}
            approve={{
                event: "click"
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
    ), [deckAPaused, dispatch])
}
