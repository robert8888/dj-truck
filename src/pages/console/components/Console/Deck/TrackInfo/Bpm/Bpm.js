import React, {useCallback, useContext, useEffect, useState} from "react"
import {connect, useDispatch} from "react-redux";
import {setBpmOrOffsetDeck} from "actions";
import DeckContext from "../../DeckCtx";

const Bpm = ({bpm, ready}) => {
    const {channel} = useContext(DeckContext);
    const dispatch = useDispatch();
    const [bpmValue, setBpmValue] = useState(bpm);

    useEffect(()=> {
        setBpmValue( bpm ? parseFloat(bpm).toFixed(2): "000")
    }, [bpm])

    const updateBpm = useCallback(()=>{
        dispatch(setBpmOrOffsetDeck(channel, parseFloat(bpmValue)))
    }, [bpmValue, channel, dispatch])

    return (
        <input
            type={"number"}
            min={62}
            max={210}
            step={0.01}
            className={"track-bpm__edit"}
            value={bpmValue}
            onChange={e => setBpmValue(e.target.value)}
            onBlur={updateBpm}
            disabled={!ready}
            onKeyDown={e => e.key === "Enter" && updateBpm()}/>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    bpm :  state.console.channel[ownProps.name].track.bpm,
    ready: state.console.channel[ownProps.name].playBackState.ready,
})

export default connect(mapsStateToProps)(Bpm);


