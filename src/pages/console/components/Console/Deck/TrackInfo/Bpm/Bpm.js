import React, {useCallback, useContext, useEffect, useMemo, useState} from "react"
import {connect, useDispatch, useSelector} from "react-redux";
import DeckContext from "../../DeckCtx";
import {setBpmOrOffsetDeck} from "actions";


const Bpm = ({bpm}) => {
    const dispatch = useDispatch();
    const [editMode, setEditMode] = useState(false);
    const [bpmValue, setBpmValue] = useState(bpm);
    useEffect(()=> {setBpmValue(parseFloat(bpm).toFixed(2))}, [bpm])

    const deckContext = useContext(DeckContext);
    const deckPaused = useSelector(state => state.console.channel[deckContext.channel].playBackState.paused);


    const value = useMemo(()=>{
        let bpmValue = "000";
        if(bpm && bpm !== "calculating"){
            bpmValue = bpm.toFixed(2);
        }
        return bpmValue;
    }, [bpm])

    const handleClick = useCallback(()=>{
        if(deckPaused){
            setEditMode(true)
        }
    }, [deckPaused, setEditMode])

    const updateBpm = useCallback(()=>{
        setEditMode(false)
        dispatch(setBpmOrOffsetDeck(deckContext.channel, parseFloat(bpmValue)))
    }, [setEditMode, bpmValue, deckContext, dispatch])

    return (
        <div onClick={handleClick}>
            {editMode ?
                <input
                    type={"number"}
                    min={62}
                    max={210}
                    step={0.01}
                    className={"track-bpm__edit"}
                    value={bpmValue}
                    onChange={e => setBpmValue(e.target.value)}
                    onBlur={updateBpm}
                    onKeyDown={e => e.key === "Enter" && updateBpm()}
                    ref={ref => ref && ref.focus()}/> :
                <span className="track-bpm__init">{value}</span>
            }

        </div>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    bpm :  state.console.channel[ownProps.name].track.bpm,
})

export default connect(mapsStateToProps)(Bpm);


