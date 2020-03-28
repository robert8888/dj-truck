import React, { useState,  useCallback } from "react";
import RecordButton from "./../componets/RecordButton/RecordButton";
import RecordNameInput from "./../componets/RecordNameInput/RecordNameInput";
import RecordTime from "../componets/RecordTime/RecordTime";
import "./recorder.scss";


const Recorder = props =>{
    const [inputDisabled, setInputDisabled] = useState(false);
    const [timeRuning, setTimeRuning] = useState(false)

    let clearTimeHandler;

    const assignClearHandler = useCallback( handler => {
        if(!clearTimeHandler){
            clearTimeHandler = handler;
        }
    }, clearTimeHandler)

    const recordStateChange = useCallback((state)=>{
        setInputDisabled(!!state);
        setTimeRuning(!!state); 
        if(!state){
            clearTimeHandler();
        }
    }, [setInputDisabled, setTimeRuning])

    return (
        <div className="recorder">
            <div className="label">REC</div>
            <RecordButton 
                onChange={recordStateChange} />
            <RecordNameInput 
                disabled={inputDisabled}/>
            <RecordTime 
                runing={timeRuning} 
                clearHandler={ assignClearHandler }/>
        </div>
    )
}

export default Recorder;