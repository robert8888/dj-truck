import React, {useMemo} from "react";
import {Step} from "react-rtg";
import useRefSelector from "pages/common/Hooks/useRefSelector";

export default function useStep_7(){
    const deckAReady = useRefSelector(state => state?.console.channel.A.playBackState.ready)

    return useMemo(() => (
        <Step
            key={"Step_7"}
            placement={"right"}
            selector={".deck.deck--A"}
            onBeforeNext={() => deckAReady.current}
        >
            <p>
                Now your track is loading, when it will be ready you
                can start playback by click play button.
            </p>
        </Step>
    ), [deckAReady])
}
