import React, {useEffect, useRef, useState, useCallback} from "react";

/// to do under constructing - developing not finished


export default function usePinchZoom(scale, direction){
    const [zoom, setZoom] = useState(1);
    const target = useRef();
    const eventCache = useRef([])

    const pointerMove = useCallback((e) => {
        e.preventDefault();
        console.log(e.scale)
    }, [eventCache])


    const removeEvents = useCallback(()=>{
        window.removeEventListener("pointermove", pointerMove, {passive: false});
        window.removeEventListener("pointerup", removeEvents)
        window.removeEventListener("pointercancel", removeEvents)
        window.removeEventListener("pointerout", removeEvents)
        window.removeEventListener("pointerleave", removeEvents)
        eventCache.current = [];
    }, [eventCache])

    const pointerDown = useCallback((e) => {
        console.log(e)
        e.preventDefault();
        if(!eventCache.current.length){
            window.addEventListener("pointermove", pointerMove, {passive: false});
            window.addEventListener("pointerup", removeEvents)
            window.addEventListener("pointercancel", removeEvents)
            window.addEventListener("pointerout", removeEvents)
            window.addEventListener("pointerleave", removeEvents)
        }
        eventCache.current.push(e);
    }, [eventCache])

    useEffect(() => {
        if(!target.current || !(target.current instanceof HTMLElement)) return;

        target.current.addEventListener("touchstart", pointerDown, {passive: false});



        return () => {
            target.current.removeEventListener("pointerdown", pointerDown, {passive: false})
        }
    }, [target, pointerDown])

    return [target, zoom];
}