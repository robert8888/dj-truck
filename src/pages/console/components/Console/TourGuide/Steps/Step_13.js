import React, {useMemo} from "react";
import {Step} from "react-rtg";
import useStateValueAnimator from "../utils/useStateAnimator";
import {setCurrentEffect, setDryWet} from "actions";
import {useDispatch} from "react-redux";

export default function useStep_13(){
    const dispatch = useDispatch();

    const dryWetAnimation = useStateValueAnimator({
        action: setDryWet.bind(null, 1),
        from: 0,
        to: 50,
        duration: 3000,
        resolution: 25
    })

    return useMemo(() => (
        <Step
            key={"Step_13"}
            placement={"bottom"}
            selector={".effector.ch-1"}
            onShow={()=>{
                dispatch(setCurrentEffect(1, "Ping Pong Delay"))
                dryWetAnimation.start()
            }}
            approve={{
                lock: true,
                callback: () => dryWetAnimation === "finished"
            }}
        >
            <p>
                Now you can choice effect and adjust it amount by dry/wet knob
            </p>
        </Step>
    ), [dryWetAnimation, dispatch])
}
