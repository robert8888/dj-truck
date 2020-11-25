import React, {useContext, useCallback} from "react";
import {setBpmOrOffsetDeck} from "../../../../../../../actions";
import DeckContext from "../../DeckCtx";
import "./beat-offset-button.scss"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faICursor} from "@fortawesome/free-solid-svg-icons";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "react-bootstrap";
import Console from "../../../../../core/console/console";
import {Logger, Log} from "../../../../../../../utils/logger/logger"

const BeatOffsetButton = () => {
    const deckContext = useContext(DeckContext);
    const deckPaused = useSelector(state => state.console.channel[deckContext.channel].playBackState.paused);
    const dispatch = useDispatch();

    const handleClick = useCallback(()=>{
        const asyncCallback = async () =>{
            const consoleInstance = await Console.Get();
            const channelInterface = consoleInstance.getChannelInterface(deckContext.channel);
            const currentTime = channelInterface.getCurrentTime();
            dispatch(setBpmOrOffsetDeck(deckContext.channel, null, currentTime.sampleTime))
        }
       asyncCallback().catch((err)=>{
           Logger.push(Log.Error(["console", "deck", "set offset button"], err))
       });
    }, [deckContext, dispatch])

    return (
        <Button
            disabled={!deckPaused}
            data-tooltip={"set beat start position"}
            onClick={handleClick}
            className={"btn--beat-offset btn--" + deckContext.channel}>
                <FontAwesomeIcon icon={faICursor}/>
        </Button>
    )
}

export default BeatOffsetButton;