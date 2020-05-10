import React, { useState,  useCallback, useEffect } from "react";
import { connect } from "react-redux";
import { createRecordinRequest , endRecording } from "./../../../../../../actions";
import RecordButton from "./../componets/RecordButton/RecordButton";
import RecordNameInput from "./../componets/RecordNameInput/RecordNameInput";
import RecordTime from "../componets/RecordTime/RecordTime";
import RECORDER_STATE from "./../../../../../../reducers/console/recorder/stateDef";
import "./recorder.scss";


const Recorder = ({ recordingState, startRecording, endRecording , userLogged, recName }) =>{
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [inputDisabled, setInputDisabled] = useState(false);
    const [timeRuning, setTimeRuning] = useState(false)
    const [prepering, setPrepering] = useState(false)
    const [_recName , setRecName] = useState("");

    const [clearTime , setClearTimeHandler] = useState(null);

    useEffect(()=>{
        setRecName(recName);
    },[recName, setRecName])

    useEffect(()=>{
        setInputDisabled(!userLogged);
        setButtonDisabled(!userLogged);
    }, [userLogged, setButtonDisabled, setInputDisabled])

    const assignClearHandler = useCallback( handler => {
        setClearTimeHandler(() => handler)
    }, [setClearTimeHandler])


    const recordStateChange = useCallback((state)=>{
        if(state){
            startRecording(_recName);
            setPrepering(true)
        } else {
            endRecording();
            clearTime();
        }
        setInputDisabled(state);
    }, [setInputDisabled, 
        startRecording, 
        endRecording, 
        _recName, 
        clearTime])

    //time runing after state change in respone to server
    useEffect(()=>{
        switch(recordingState){
            case RECORDER_STATE.INIT:{
                setPrepering(true);
                break;
            }
            case RECORDER_STATE.FAIL:{
                setPrepering(false);
                break;
            }
            case RECORDER_STATE.RECORDING : {
                setPrepering(false);
                setTimeRuning(true);
                break;
            }
            case RECORDER_STATE.IDLE : {
                setPrepering(false);
                setTimeRuning(false);
                break;
            }
            default : return;
        }
    }, [recordingState, setTimeRuning, setPrepering])


    return (
        <div className="recorder">
            <div className="label">REC</div>
            <RecordButton 
                onChange={recordStateChange}
                disabled={buttonDisabled} />
            <RecordNameInput 
                disabled={inputDisabled}
                value= { _recName }
                onChange={str => setRecName(str)}/>
            <RecordTime 
                prepering={prepering}
                runing={timeRuning} 
                clearHandler={ assignClearHandler }/>
        </div>
    )
}

const mapStateToProps = state => ({
    recordingState : state.recorder.recordingState,
    recName : state.recorder.recName,
    userLogged : state.user.logged,
})

const mapDispatchToProps = dispatch => ({
    startRecording : recName => dispatch(createRecordinRequest(recName)),
    endRecording : () => dispatch(endRecording())
})

export default connect(mapStateToProps, mapDispatchToProps)(Recorder);