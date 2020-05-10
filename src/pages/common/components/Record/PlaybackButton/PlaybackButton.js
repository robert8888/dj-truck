import React , { useEffect, useMemo, useCallback } from "react";
import BinaryButton from "./../../BinnaryButton/BinnaryButton"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from "classnames"
import "./playback-button.scss"
import usePlaybackState, {PLAYBACK_STATE} from "./../../../Hooks/usePlabackState";

const PlaybackButton = ({playback, id, player}) => {
    const onChange = useCallback((state)=> {
        if(playback){
            playback(id , state);
        }
    }, [playback, id])

    const [state, icon, toggleHandler, setState] = usePlaybackState(onChange);

    useEffect(()=>{
        if(!player){
            return;
        }
        player.addBtnCtrlHandler(id, (s) => setState(s))
        if(player.getCurrent().id === id){
            setState(player.getCurrent().state);
        }
        return () => {
            player.removeBtnCtrlHandler(id);
        }
    }, [player, id, setState])

    const btnClassNames = useMemo(()=>{
        return classNames(
            "playback-button",
            {
                "playback-button--active": (state === PLAYBACK_STATE.PLAY)
            }
        )
    }, [state])


    return (
        <div className="playback-button-container">
            <BinaryButton className={btnClassNames} onChange={toggleHandler}>
                <FontAwesomeIcon icon={icon}/>
            </BinaryButton>
        </div>
    )
}

export default PlaybackButton