import React, {useMemo} from "react";
import {Step} from "react-rtg";
import useStateValueAnimator from "../utils/useStateAnimator";
import {setFilter} from "../../../../../../actions";

export default function useStep_19(){
    const filterToHighAnimation = useStateValueAnimator({
        action: setFilter.bind(null, "A"),
        from: 0,
        to: 10,
        duration: 5000,
        resolution: 20,
    })

    return useMemo(() => (
        <Step
            key={"Step_19"}
            placement={"right"}
            selector={".channel-A .filter-knob"}
            onShow={() => filterToHighAnimation.start()}
            approve={{
                callback: () => filterToHighAnimation.state === "finished"
            }}>
            <p>
                For fast manipulation of frequency range you can use high and low pass filter with resonance
            </p>
        </Step>
    ), [filterToHighAnimation])
}
