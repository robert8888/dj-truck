import {useCallback, useRef} from "react";
import {useDispatch} from "react-redux";

export default function useStateValueAnimator({action, from, to, duration, resolution}){
    const dispatch = useDispatch();
    const onEndRef = useRef();
    const value = useRef(from);
    const intervalHandler = useRef(null)
    const state = useRef("created");

    const start = useCallback(() => {
        const timeout = duration / resolution;
        const step = (to - from) / resolution;
        if(!step || state.current === "running" || state.current === "finished") return;
        state.current = "running";
        intervalHandler.current = setInterval(() => {
            value.current += step;
            dispatch(action(value.current))
            if((step > 0 && value.current >= to) || (step < 0 && value.current <= to)){
                clearInterval(intervalHandler.current);
                typeof onEndRef.current === "function" && onEndRef.current();
                state.current = "finished"
            }
        }, timeout)

        setTimeout(() => clearInterval(intervalHandler.current), duration * 1.1)
    }, [dispatch, onEndRef, value, intervalHandler, state,
         from, to , action, duration, resolution])

    const stop = useCallback(()=>{
        clearInterval(intervalHandler.current)
        state.current = "stopped";
    },[intervalHandler, state])

    const restart = useCallback(()=>{
        value.current = from;
        state.current = "restarted";
    }, [value, state, from])

    return {
        set onEnd(callback){
            onEndRef.current = callback;
        },
        get state(){
           return state.current;
        },
        start,
        stop,
        restart,
    }
}

/*
valueAnimator = useStateValueAnimator({
    selector: state => state.console.channel.A.pitch
    from: 5
    to: 10
    duration: 5000,
    resolution: 10,
});

valueAnimator.start();
valueAnimator.onEnd = () => {
    console.log("animation ended)
}
 */