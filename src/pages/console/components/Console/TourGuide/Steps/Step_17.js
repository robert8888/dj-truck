import React, {useMemo} from "react";
import {Step} from "react-rtg";
import useStateValueAnimator from "../utils/useStateAnimator";
import {setFader} from "../../../../../../actions";

export default function useStep_17(){
    const faderToCenterAnimation = useStateValueAnimator({
        action: setFader,
        from: -50,
        to: 0,
        duration: 4000,
        resolution: 25
    })

    return useMemo(() => (
        <Step
            key={"Step_17"}
            placement={"top-right"}
            selector={".fader.mixer-fader"}
            onBeforeShow={() => faderToCenterAnimation.start()}
            onBeforeNext={() => {
                console.log(faderToCenterAnimation.state )
                return faderToCenterAnimation.state === "finished"
            }}
        >
            <p>
                Yeah !!!
            </p>
            <p>
                It is a perfect time to start mixing by moving fader back to center position
            </p>
        </Step>
    ), [faderToCenterAnimation])
}
