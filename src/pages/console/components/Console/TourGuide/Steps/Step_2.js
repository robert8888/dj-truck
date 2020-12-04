import React, {useCallback, useEffect, useMemo, useRef} from "react";
import {Step} from "react-rtg";
import {useSelector} from "react-redux";
import useTapeIn from "../utils/useTapeIn";

export default function useStep_2(){
    const tapeIn = useTapeIn()
    const searchResultLength = useSelector(state => state?.search?.searchResults?.length);
    const secondStepPromiseResolver = useRef();
    const once = useRef(false)

    useEffect(()=>{
        if(once.current || !searchResultLength || !secondStepPromiseResolver.current) return;
        once.current = true;
        secondStepPromiseResolver.current();
    }, [searchResultLength, secondStepPromiseResolver, once])


    const startTapeIn = useCallback(() =>{
        const target = document.querySelector("[data-rtg-search-input]");
        if(!target) return;
        tapeIn(target, "Maceo Plex Conjure Dreams", 100);
    }, [tapeIn])

    return useMemo(() =>(
        <Step
            key={"Step_2"}
            placement={"top"}
            selector={"[data-rtg-search-input]"}
            onShow={startTapeIn}
            approve={{
                lock: true,
                promise: () => new Promise((res)=> {
                    secondStepPromiseResolver.current = () => res();
                })
            }}
        >
            <p>
                Just type in artis and / or title of track and find it on your favorite platform.
            </p>
        </Step>
        ), [secondStepPromiseResolver, startTapeIn])
}
