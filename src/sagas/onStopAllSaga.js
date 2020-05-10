import {  ACTIONS, endRecording, consoleResetChannels} from "../actions";
import RECORD_STATE from "./../reducers/console/recorder/stateDef";
import { takeEvery, select, put} from "redux-saga/effects";


export default function* interceptLoadtrack() {
    yield takeEvery(ACTIONS.CONSOLE_STOP_ALL, handel)
}


const isRecording = state => state.recorder.recordingState === RECORD_STATE.RECORDING; 

function* handel(){
    yield(put(consoleResetChannels()))

    const recording = yield select(isRecording);
    if(!recording) return;
    yield(put(endRecording()))
}