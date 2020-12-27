import React, {   useState, useCallback, useEffect, useRef} from "react"
import { calcBpm } from "utils/bpm/converter";
import { connect } from "react-redux";
import {setPitch} from "actions";

const CurrentBpm = ({pitch, bpm, setPitch, ready}) => {
    const [editedValue, setEditedValue] = useState(0)
    const editedValueRef = useRef()
    const movedFlag = useRef(false);

    useEffect(() => {
        editedValueRef.current = +editedValue
    }, [editedValueRef, editedValue])

    useEffect(()=>{
        setEditedValue(bpm && bpm !== "calculating" ?  calcBpm(bpm, pitch).toFixed(2) : "000" )
    }, [bpm,  pitch])

    const finishEdit = useCallback(() => {
        const pitch = (editedValueRef.current / bpm - 1) * 100;
        if(isNaN(pitch) || !bpm) return;
        setPitch(pitch)
    },[bpm, setPitch, editedValueRef])

    const pointerMove = useCallback((startY, startValue, e) => {
        e.preventDefault();
        const scale = 100;
        const clientY = e.clientY || e.touches[0].clientY;
        const deltaY = clientY - startY;
        setEditedValue(+startValue  + deltaY / scale)
        movedFlag.current = true;
    }, [setEditedValue, movedFlag])

    const pointerStart = useCallback((e) => {
        if(!editedValueRef.current) return;

        const clientY = e.clientY || e.touches[0].clientY;
        const pMove = pointerMove.bind(null, clientY, +editedValue);
        e.target.addEventListener("touchmove", pMove, {passive: false})
        e.target.addEventListener("touchend", function touchEnd(){
              window.removeEventListener("touchend", touchEnd);
              window.removeEventListener("touchmove", pMove, {passive: false});
              if(movedFlag.current){
                  finishEdit()
              }
        })
        movedFlag.current = false;
        return false;
    }, [editedValue, finishEdit, movedFlag, pointerMove])


    return (
        <div className={"track-bpm-current__wrapper"}
             onTouchStart={pointerStart}>
            <input className="track-bpm-current track-bpm-current__input"
                   value={editedValue || "000"}
                   onKeyDown={e => e.key === "Enter" && finishEdit()}
                   onChange={e => setEditedValue(e.target.value)}
                   onBlur={finishEdit}
                   disabled={!ready}
                   type="number"/> :
        </div>

    )
}

const mapsStateToProps = (state, ownProps) => ({
    bpm :  state.console.channel[ownProps.channel].track.bpm,
    pitch :  state.console.channel[ownProps.channel].playBackState.pitch.current,
    ready :  state.console.channel[ownProps.channel].playBackState.ready,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    setPitch: pitch => dispatch(setPitch(ownProps.channel, pitch))
})

export default connect(mapsStateToProps, mapDispatchToProps)(CurrentBpm);


