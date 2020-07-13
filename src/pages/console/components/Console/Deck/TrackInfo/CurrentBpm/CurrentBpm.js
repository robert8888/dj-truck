import React, { useRef, useEffect } from "react"
import { calcBpm } from "./../../../../../../../utils/bpm/converter";
import { connect } from "react-redux";


const CurrentBpm = ({pitch, bpm}) => {
    const container = useRef(null);

    useEffect(()=>{
        let currentBpm = "000";
        if(bpm && bpm !== "calculating"){
            currentBpm = calcBpm(bpm, pitch).toFixed(2);
        } 
        container.current.textContent = currentBpm;
    }, [bpm, container, pitch])
    
    return (
        <span className="track-bpm-current" ref={container}/>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    bpm :  state.console.channel[ownProps.name].track.bpm,
    pitch :  state.console.channel[ownProps.name].playBackState.pitch.current,
})

export default connect(mapsStateToProps)(CurrentBpm);


