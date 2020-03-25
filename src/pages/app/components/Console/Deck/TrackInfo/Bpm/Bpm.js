import React, { useRef, useEffect } from "react"
import { connect } from "react-redux";


const Bpm = props => {
    const container = useRef(null);

    useEffect(()=>{
        let bpm = "000";
        if(props.bpm){
            bpm = props.bpm.toFixed(2);
        }
        container.current.textContent = bpm;
    }, [props.bpm, container])

    return (
        <span className="track-bpm-init" ref={container}/>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    bpm :  state.console.channel[ownProps.name].track.bpm,
})

export default connect(mapsStateToProps)(Bpm);


