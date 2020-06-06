import React, { useRef, useEffect, useState} from "react"
import { formater } from "./../../../../../../../utils/time/timeFromater";
import { connect } from "react-redux";
import Console from "./../../../../../core/console/console";

const TimeLeft = ({duration, playback, name}) => {
    const container = useRef(null);
    const intervalHandler = useRef(null)

    const [channelInterface, setChannelInterface] =  useState(null);

    useEffect(()=>{ 
        setChannelInterface(Console.Get().getChannelInterface(name));
    }, [setChannelInterface, name])

    useEffect(()=>{
        if(!channelInterface || !container.current) return;

        if(playback){
            intervalHandler.current = setInterval(()=>{
                let left = channelInterface.getCurrentTime().left;
                left = formater.secondsToStr(left);
                if(!container.textContent) return;
                container.current.textContent = left;
            }, 500)
        } else {
            clearInterval(intervalHandler.current);
        }
    }, [playback,
        duration,
        container,
        intervalHandler,
        channelInterface])

    useEffect(()=>()=> {
        if(intervalHandler.current){
            clearInterval(intervalHandler.current)
        }
    }, [intervalHandler]);

    return (
        <span className="time-left" ref={container}/>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    duration: state.console.channel[ownProps.name].track.duration,
    playback: state.console.channel[ownProps.name].playBackState.paused,
})

export default connect(mapsStateToProps)(TimeLeft);