import React, { useMemo } from "react"
import { connect } from "react-redux";


const Bpm = ({bpm}) => {
    const value = useMemo(()=>{
        let bpmValue = "000";
        if(bpm && bpm !== "calculating"){
            bpmValue = bpm.toFixed(2);
        }
        return bpmValue;
    }, [bpm])

    return (
        <span className="track-bpm-init">{value}</span>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    bpm :  state.console.channel[ownProps.name].track.bpm,
})

export default connect(mapsStateToProps)(Bpm);


