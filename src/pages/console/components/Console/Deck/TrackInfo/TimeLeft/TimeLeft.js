import React, { useRef, useEffect, useState, useCallback} from "react"
import { formater } from "utils/time/timeFromater";
import {connect} from "react-redux";
import Console from "pages/console/core/console/console";
import {setTimeWarning} from "actions";

const timeWarningLimit = 30;// seconds

const TimeLeft = ({duration, name,timeWarning, setTimeWarning}) => {
    const intervalHandler = useRef(null);
    const [channelInterface, setChannelInterface] =  useState(null);

    const [value, setValue] = useState( formater.secondsToStr(duration));

    const timeWarningRef = useRef(timeWarning);
    useEffect(()=> { timeWarningRef.current = timeWarning }, [timeWarning]);
    const updateTimeWarning = useCallback((value) => {
         if(timeWarningRef.current !== value)
             setTimeWarning(value)
    }, [timeWarningRef, setTimeWarning])

    useEffect(()=>{
        Console.Get().then( instance => {
            setChannelInterface(instance.getChannelInterface(name))
        })
    }, [setChannelInterface, name])

    useEffect(()=>{
        if(!channelInterface) return;

        intervalHandler.current = setInterval(()=>{
            let left = channelInterface.getCurrentTime().left || duration;
            (left && left < timeWarningLimit) ? updateTimeWarning(true) : updateTimeWarning(false);
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
        updateTimeWarning,
        channelInterface])

    useEffect(()=>()=> {
        clearInterval(intervalHandler.current)
    }, [intervalHandler]);


    return (
        <span className={"time-left " + ["", "time-left--warning"][+!!timeWarning]} >{value}</span>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    duration: state.console.channel[ownProps.name].track.duration,
    ready: state.console.channel[ownProps.name].playBackState.ready,
    timeWarning: state.console.channel[ownProps.name].playBackState.timeWarning &&
        !state.console.channel[ownProps.name].playBackState.paused
})

const mapStateToProps = (dispatch , onwProps) => ({
    setTimeWarning: value => dispatch(setTimeWarning(onwProps.name, value))
})

export default connect(mapsStateToProps, mapStateToProps)(TimeLeft);