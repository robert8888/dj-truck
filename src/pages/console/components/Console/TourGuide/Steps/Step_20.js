import React, {useMemo} from "react";
import {Step} from "react-rtg";

export default function useStep_20(){
    return useMemo(() => (
        <Step key={"Step_20"} selector={"div.recorder"} placement={"bottom-right"}>
            <p>
                You can adjust compressor parameters and record yor gigs.
            </p>
            <p>
                Your find your record on page /my/records
            </p>
        </Step>
    ), [])
}
