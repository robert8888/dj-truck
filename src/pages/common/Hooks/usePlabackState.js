import {useCallback, useState, useEffect } from "react";
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'

export const PLAYBACK_STATE = {
    PLAY : "play music",
    PAUSE: "pause music"
}

export default function usePlaybackState(callback){

    const [state, setState] = useState(PLAYBACK_STATE.PAUSE);
    const [icon, setIcon] = useState(faPause);

    const toggleHandler = useCallback(()=>{
        if(state === PLAYBACK_STATE.PAUSE){
            callback && callback(PLAYBACK_STATE.PLAY);
            setState(PLAYBACK_STATE.PLAY);
        } else {
            callback && callback(PLAYBACK_STATE.PAUSE);
            setState(PLAYBACK_STATE.PAUSE);
        }
    }, [setState, state, callback])

    useEffect(()=>{
        switch(state){
            case PLAYBACK_STATE.PLAY : {
                setIcon(faPause)
                break;
            }
            case PLAYBACK_STATE.PAUSE: {
                setIcon(faPlay);
                break;
            }

            default : return;
        }
    }, [state, setIcon])

    

    return [state, icon, toggleHandler, setState]
}