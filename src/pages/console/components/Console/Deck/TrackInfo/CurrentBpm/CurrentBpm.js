import React, { useRef, useMemo } from "react"
import { calcBpm } from "./../../../../../../../utils/bpm/converter";
import { connect } from "react-redux";


const CurrentBpm = ({pitch, bpm}) => {
    const value = useMemo(()=>{
        let currentBpm = "000";
        if(bpm && bpm !== "calculating"){
            currentBpm = calcBpm(bpm, pitch).toFixed(2);
        } 
        return currentBpm;
    }, [bpm,  pitch])
    
    return (
        <span className="track-bpm-current">{value}</span>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    bpm :  state.console.channel[ownProps.name].track.bpm,
    pitch :  state.console.channel[ownProps.name].playBackState.pitch.current,
})

export default connect(mapsStateToProps)(CurrentBpm);


