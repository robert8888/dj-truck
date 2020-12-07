import { put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, pushLog, updateEndTime, updateStartTime } from "actions";
import RECORD_STATE from "./../../../reducers/console/recorder/stateDef";
import { Log } from "./../../../utils/logger/logger";

export default function* interceptPlayback() {
    yield takeEvery(ACTIONS.TOGGLE_PLAY, handel);
}

const getChannelState = (state, channel) => state.console.channel[channel];

const isRecording = state => state.recorder.recordingState === RECORD_STATE.RECORDING; 

function* handel(action){   
    try{
        const channel = action.destination;
        const channelState = yield select(getChannelState, channel)
    
        const recording = yield select(isRecording);
        if(!recording) return;
    
        const paused = !channelState.playBackState.paused;
        if(paused){
            yield put(updateStartTime(channelState.track.id))
        } else {
            yield put(updateEndTime(channelState.track.id))
        }
    } catch(error){
        yield put(pushLog(Log.Error(
            ['saga', 'recorder', 'tracklis', 'intercept toggle play action'],
            "Can't updated start / end time :" + error.message,
            error
        )))
    }
}