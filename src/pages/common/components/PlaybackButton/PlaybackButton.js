import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from "classnames";
import React, { useCallback, useEffect, useMemo } from "react";
import usePlaybackState, { PLAYBACK_STATE } from "./../../Hooks/usePlabackState";
import BinaryButton from "./../BinnaryButton/BinnaryButton";
import "./playback-button.scss";

const PlaybackButton = ({playback, id, player, source = "RecordsStore", ...props}) => {
    const onChange = useCallback((state)=> {
        if(playback){
            playback(id , state, source);
        }
    }, [playback, id, source])

    const [state, icon, toggleHandler, setState] = usePlaybackState(onChange);

    useEffect(()=>{
        if(!player){
            return;
        }
        player.subscribePlayback(id, (s) => setState(s))

        const current = player.getCurrent();
        if(current.id === id && current.source === source){
            setState(player.getCurrent().state);
        }

        return () => {
            player.unSubscribePlayback(id);
        }
        
    }, [player, id, source, setState])

    const btnClassNames = useMemo(()=>{
        return classNames(
            "playback-button",
            {
                "playback-button--active": (state === PLAYBACK_STATE.PLAY)
            }
        )
    }, [state])

    return (
        <div className={"playback-button-container " + props.className}>
            <BinaryButton className={btnClassNames} onChange={toggleHandler} value={(state===PLAYBACK_STATE.PLAY)}>
                <FontAwesomeIcon icon={icon}/>
            </BinaryButton>
        </div>
    )
}

export default PlaybackButton