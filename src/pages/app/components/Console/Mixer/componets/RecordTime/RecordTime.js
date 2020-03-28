import React, { useState, useEffect, useCallback } from "react";
import {formater as timeFormater }from "./../../../../../../../utils/time/timeFromater";
import "./record-time.scss"

const RecordTime = props => {
    const [time, setTime] = useState(0);
    const [timerInterval, setIntervalHandler] = useState(null);

    useEffect(()=>{
        if(props.runing && !timerInterval){
            setIntervalHandler(setInterval(()=>{
                setTime(time => ++time);
            }, 1000))
        } else if(!props.runing && timerInterval) {
            clearInterval(timerInterval);
            setIntervalHandler(null);
        }

    },[ props.runing, 
        setTime, 
        setIntervalHandler,
        timerInterval
    ])

    const clearHandler = useCallback(()=>{
        setTime(0)
    }, [setTime])

    useEffect(()=>{
        if(props.clearHandler instanceof Function){
            props.clearHandler(clearHandler)
        }
    }, [])

    return(
        <div className="record-time">
            <span>{ timeFormater.secondsToStr(time) }</span>
        </div>
    )
}

export default RecordTime;