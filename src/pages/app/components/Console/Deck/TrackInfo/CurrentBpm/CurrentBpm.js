import React, { useRef, useEffect } from "react"
import { calcBpm } from "./../../../../../../../utils/bpm/converter";
import { connect } from "react-redux";


const CurrentBpm = props => {
    const container = useRef(null);

    useEffect(()=>{
        let currentBpm = "000";
        if(props.bpm){
            currentBpm = calcBpm(props.bpm, props.pitch).toFixed(2);
        } 
        container.current.textContent = currentBpm;
    }, [props.bpm, container, props.pitch])
    
    return (
        <span className="track-bpm-current" ref={container}/>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    bpm :  state.console.channel[ownProps.name].track.bpm,
    pitch :  state.console.channel[ownProps.name].playBackState.pitch,
})

export default connect(mapsStateToProps)(CurrentBpm);


