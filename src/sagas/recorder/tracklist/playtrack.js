import {  ACTIONS, updateStartTime, updateEndTime  } from "../../../actions";
import { takeEvery, select, put,} from "redux-saga/effects";
import RECORD_STATE from "./../../../reducers/console/recorder/stateDef";

export default function* interceptPlay() {
    yield takeEvery(ACTIONS.CANCEL_CUE_AND_PLAY, handel);
}

const getChannelState = (state, channel) => state.console.channel[channel];

const isRecording = state => state.recorder.recordingState === RECORD_STATE.RECORDING; 

function* handel(action){
    console.log('intercept toogle play')
    const channel = action.destination;
    const channelState = yield select(getChannelState, channel)

    const recording = yield select(isRecording);
    if(!recording) return;


    yield put(updateStartTime(channelState.track.id))
}