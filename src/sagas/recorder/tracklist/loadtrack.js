import {  ACTIONS, pushToTracklist, updateEndTime, recording } from "../../../actions";
import RECORD_STATE from "./../../../reducers/console/recorder/stateDef";
import { takeEvery, select, put, call} from "redux-saga/effects";


export default function* interceptLoadtrack() {
    yield takeEvery(ACTIONS.LOAD_TRACK, handel)
}

const getTracklist = state => state.recorder.tracklist;

const isRecording = state => state.recorder.recordingState === RECORD_STATE.RECORDING; 

function * finishInfinite(tracklist , channel){
    const unfinished = tracklist.find(track => 
        (track.channel === channel && track.start && !track.end)
    )
    if(!unfinished) return; 

    yield put(updateEndTime(unfinished.id))
}

function* handel(action){
    const channel = action.destination;
    const track = action.track;
    
    const recording = yield select(isRecording);
    if(!recording) return;

    const tracklist = yield select(getTracklist);
    yield call(finishInfinite, tracklist, channel);

    yield put(pushToTracklist({
        id: track.id,
        channel,
        start: null,
        end: null,
    }))

}