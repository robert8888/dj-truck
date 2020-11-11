import React, {useMemo} from "react";
import {Step} from "react-rtg";

export default function useStep_5(){
    return useMemo(() => (
        <Step key={"Step_5"} placement={"top"} selector={".track-list-table-row"}>
            <p>
                New track is added to playlist. Bpm analyzer start its work.
            </p>
        </Step>
    ), [])
}
