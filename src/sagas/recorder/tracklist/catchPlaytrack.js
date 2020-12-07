import { put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, pushLog, updateStartTime } from "actions";
import RECORD_STATE from "./../../../reducers/console/recorder/stateDef";
import { Log } from "./../../../utils/logger/logger";

export default function* interceptPlay() {
    yield takeEvery(ACTIONS.CANCEL_CUE_AND_PLAY, handel);
}

const getChannelState = (state, channel) => state.console.channel[channel];

const isRecording = state => state.recorder.recordingState === RECORD_STATE.RECORDING; 

function* handel(action){
    const path = ['saga', 'recorder', 'tracklis', 'intercept play after cue action'];
    try{
        const recording = yield select(isRecording);
        if(!recording) {
            return;
        }

        const channel = action.destination;
        const channelState = yield select(getChannelState, channel)

        yield put(updateStartTime(channelState.track.id))

        yield put(pushLog(
                new Log(`Track start time updated on tracklis channel${channel} id: ${channelState.track.id}`, path)
            )) 
    } catch (error){
        yield put(pushLog(Log.Error(
            path,
            "Can't update start time on track on tracklist. " + error.message,
            "Sorry during process of updating record tracklist occurred a problem",
            error
        )))
    }

}