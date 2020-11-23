import React, { useRef, useEffect, useState} from "react"
import { formater } from "../../../../../../../utils/time/timeFromater";
import {connect, useSelector} from "react-redux";
import Console from "./../../../../../core/console/console";

const TimeLeft = ({duration, name}) => {
    const intervalHandler = useRef(null);
    const [channelInterface, setChannelInterface] =  useState(null);

    const [value, setValue] = useState(0);

    useEffect(()=>{
        Console.Get().then( instance => {
            setChannelInterface(instance.getChannelInterface(name))
        })
    }, [setChannelInterface, name])

    useEffect(()=>{
        if(!channelInterface) return;

        intervalHandler.current = setInterval(()=>{
            let left = channelInterface.getCurrentTime().left || duration;
            left = formater.secondsToStr(left);
            setValue(left)
        }, 500)

        return () => {
            clearInterval(intervalHandler.current)
        }
    }, [
        duration,
        setValue,
        intervalHandler,
        channelInterface])

    useEffect(()=>()=> {
        clearInterval(intervalHandler.current)
    }, [intervalHandler]);

    return (
        <span className="time-left" >{value}</span>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    duration: state.console.channel[ownProps.name].track.duration,
    ready: state.console.channel[ownProps.name].playBackState.ready,
})

export default connect(mapsStateToProps)(TimeLeft);