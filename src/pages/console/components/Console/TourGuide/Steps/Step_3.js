import React, {useMemo} from "react";
import {Step} from "react-rtg";
import useEventDispatcher from "../utils/useEventDispatcher";

export default function useStep_3(){
    const dispatchEvent = useEventDispatcher();

    return useMemo(() => (
        <Step
            key={"Step_3"}
            placement={"top"}
            selector={".search-results__item"}
            approve={{
                event: "click",
                delay: 300,
            }}
            onBeforeNext={(state => () =>{
                if(state.fired) return
                state.fired = true;
                dispatchEvent(
                    document.querySelector(".search-results__item"),
                    [MouseEvent, "click"],
                )
                return true;
            })({fired: false})}
        >
            <p>
                Choice track from search results
            </p>
        </Step>
    ), [dispatchEvent])
}
