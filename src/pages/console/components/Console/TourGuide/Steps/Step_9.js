import React, {useMemo} from "react";
import {Step} from "react-rtg";
import useStateValueAnimator from "../utils/useStateAnimator";
import {setFader} from "../../../../../../actions";

export default function useStep_9(){
    const faderToLeftAnimation = useStateValueAnimator({
        action: setFader,
        from: 0,
        to: -50,
        duration: 3000,
        resolution: 25,
    })

    return useMemo(() => (
        <Step
            key={"Step_9"}
            placement={"top-right"}
            selector={".fader.mixer-fader"}
            onBeforeShow={() => faderToLeftAnimation.start()}
            onBeforeNext={() => faderToLeftAnimation.state === "finished"}
        >
            <p>
                Now you can use fader to channel A, so that only the right channel will be heard.
            </p>
        </Step>
    ), [faderToLeftAnimation])
}
