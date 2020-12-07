import { call, put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, pushLog, pushToTracklist, updateEndTime } from "actions";
import RECORD_STATE from "./../../../reducers/console/recorder/stateDef";
import { Log } from "./../../../utils/logger/logger";

export default function* interceptLoadtrack() {
    yield takeEvery(ACTIONS.LOAD_TRACK, handel)
}

const getTracklist = state => state.recorder.tracklist;

const isRecording = state => state.recorder.recordingState === RECORD_STATE.RECORDING; 

function * finishUnfinished(tracklist , channel){
    const unfinished = tracklist.find(track => 
        (track.channel === channel && track.start && !track.end)
    )
    if(!unfinished) return; 

    yield put(updateEndTime(unfinished.id))
}

function* handel(action){
    try{
        const channel = action.destination;
        const track = action.track;
        
        const recording = yield select(isRecording);
        if(!recording) return;
    
        const tracklist = yield select(getTracklist);
        yield call(finishUnfinished, tracklist, channel);
    
        yield put(pushToTracklist({
            id: track.id,
            channel,
            start: null,
            end: null,
        }))
        
    } catch(error){
        yield put(pushLog(Log.Error(
            ['saga', 'recorder', 'tracklis', 'intercept load track to deck'],
            "Can't add track to tracklist. :" + error.message,
            error
        )))
    }


}