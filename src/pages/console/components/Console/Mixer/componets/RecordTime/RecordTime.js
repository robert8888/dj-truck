import React, { useState, useEffect, useCallback, useMemo } from "react";
import {formater as timeFormater }from "./../../../../../../../utils/time/timeFromater";
import classNames from "classnames";
import "./record-time.scss"

const RecordTime = ({runing, prepering, clearHandler}) => {
    const [time, setTime] = useState(0);
    const [timerInterval, setIntervalHandler] = useState(null);

    useEffect(()=>{
        if(runing && !timerInterval){
            setIntervalHandler(setInterval(()=>{
                setTime(time => ++time);
            }, 1000))
        } else if(!runing && timerInterval) {
            clearInterval(timerInterval);
            setIntervalHandler(null);
        }

    },[ runing, 
        setTime, 
        setIntervalHandler,
        timerInterval
    ])

    const clear = useCallback(()=>{
        setTime(0)
    }, [setTime])

    useEffect(()=>{
        if(clearHandler instanceof Function){
            clearHandler(clear)
        }
    }, [clearHandler, clear])

    const containerClassNames = useMemo(()=>{
        return classNames(
            "record-time",
            {
                "record-time--prepering": prepering
            }
        )
    }, [prepering])

    return(
        <div className={containerClassNames}>
            <span>{ timeFormater.secondsToStr(time) }</span>
        </div>
    )
}

export default RecordTime;