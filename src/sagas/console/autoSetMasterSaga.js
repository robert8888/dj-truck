import { put, select, takeEvery } from 'redux-saga/effects';
import {ACTIONS, setMaster} from "actions";
import { Logger, Log } from "utils/logger/logger";

export default function* watcher() {
    yield takeEvery(ACTIONS.SET_READY, handle);
}

const selectSecondChannelName = (state, channel) => {
    return Object.keys(state.console.channel).find(name => name !== channel)
}

const selectSyncable = (state, channelName) =>{
    return state.console.channel[channelName].track.bpm !== 0 &&
        state.console.channel[channelName].track.offset !== 0;
}

function* handle(action) {
    const {destination: channel, value: isReady} = action;
    if(!isReady) return;
    const secondChannel = yield select(selectSecondChannelName, channel);
    const isSyncable = yield select(selectSyncable, channel);
    const isSecondSyncable = yield select(selectSyncable, secondChannel);

    if(!isSyncable || !isSecondSyncable)
        return;

    yield put(setMaster(secondChannel, null))

    Logger.push(new Log(`Player ${secondChannel} is auto marked as master`));
}