import React, { useRef, useEffect } from "react"
import { connect } from "react-redux";


const Pitch = props => {
    const container = useRef(null);

    useEffect(()=>{
        container.current.textContent = props.pitch.toFixed(2);
    }, [container, props.pitch])

    return (
        <span className="track-bpm-pitch" ref={container}/>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    pitch :  state.console.channel[ownProps.name].playBackState.pitch.current,
})

export default connect(mapsStateToProps)(Pitch);
