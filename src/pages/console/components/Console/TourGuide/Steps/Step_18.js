import React, {useMemo} from "react";
import {Step} from "react-rtg";

export default function useStep_18(){

    return useMemo(() => (
        <Step
            key={"Step_18"}
            placement={"right"}
            selector={".channel-A .knobs-set-1"}
            approve={{
                event: "click"
            }}
        >
            <p>
                You have to disposition three band equalizer
            </p>
            <p>
                Double click will set knob back to middle position
            </p>
        </Step>
    ), [])
}
