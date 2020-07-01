import React, { useRef, useEffect, useState} from "react"
import { formater } from "./../../../../../../../utils/time/timeFromater";
import { connect } from "react-redux";
import Console from "./../../../../../core/console/console";

const TimeLeft = ({duration, paused, name}) => {
    const container = useRef(null);
    const intervalHandler = useRef(null)

    const [channelInterface, setChannelInterface] =  useState(null);

    useEffect(()=>{
        Console.Get().then( instance => {
            setChannelInterface(instance.getChannelInterface(name))
        })
      //  setChannelInterface(Console.Get().getChannelInterface(name));
    }, [setChannelInterface, name])

    useEffect(()=>{
        if(!channelInterface || !container.current) return;

        if(!paused){
            intervalHandler.current = setInterval(()=>{
                let left = channelInterface.getCurrentTime().left;
                left = formater.secondsToStr(left);
                if(!container.current) return;
                container.current.textContent = left;
            }, 500)
        } else {
            clearInterval(intervalHandler.current);
            container.current.textContent = formater.secondsToStr(duration);
        }
    }, [paused,
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
    paused: state.console.channel[ownProps.name].playBackState.paused,
})

export default connect(mapsStateToProps)(TimeLeft);