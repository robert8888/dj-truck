import React, {useMemo, useEffect, useState, useCallback} from "react";
import BinaryButton from "./../../BinnaryButton/BinnaryButton";
import usePlaybackState , {PLAYBACK_STATE} from "./../../../Hooks/usePlabackState";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from "classnames"
import "./playback-button.scss";

const PlaybackButton = ({playback, player}) => {

    const [state, icon, toggleHandler, setState] = usePlaybackState();

    const btnClassNames = useMemo(()=>{
        return classNames(
            "playback-button",
            {
                "playback-button--active": (state === PLAYBACK_STATE.PLAY)
            }
        )
    }, [state])

    const [current, setCurrent] = useState();
    
    useEffect(()=>{
        if(current){
            setState(current.state);
        }
    }, [current, setState])

    useEffect(()=>{
        if(player){
           player.subscribeCurrent(setCurrent);
        }

        return () => {
            player.unSubscribeCurrent(setCurrent);
        }
    }, [player, setCurrent])

    const buttonClick = useCallback((...args)=>{
        if(!current){
            return;
        }
        toggleHandler(...args);
        const nextState = (state === PLAYBACK_STATE.PLAY) ? PLAYBACK_STATE.PAUSE : PLAYBACK_STATE.PLAY;
        playback( null , nextState);
    }, [toggleHandler, current, playback, state])


    return (
        <div className="playback-button-container">
            <BinaryButton className={btnClassNames} onChange={buttonClick}>
                <FontAwesomeIcon icon={icon}/>
            </BinaryButton>
        </div>
    )

}

export default PlaybackButton;
