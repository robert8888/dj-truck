import {takeEvery, select, put} from "redux-saga/effects";
import {ACTIONS, setHeaderVar} from "actions";

export default function* watcher() {
    yield takeEvery(ACTIONS.TOGGLE_PLAY, handle);
    yield takeEvery(ACTIONS.TOGGLE_CUE, handle);
    yield takeEvery(ACTIONS.CANCEL_CUE_AND_PLAY, handle);
}

const selectPlaying = state =>
    Object.keys(state.console.channel)
    .filter(channelName =>
        !state.console.channel[channelName].playBackState.paused
    )

function* handle(){
    const paused = yield select(selectPlaying);

    const vars = {};
    vars.disabled = !!paused.length;

    yield  put(setHeaderVar(vars));
}