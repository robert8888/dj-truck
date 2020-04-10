import { ACTIONS } from "../actions";
import { put, call, takeEvery } from 'redux-saga/effects';
import { getApi } from "./../apis/apiProvider";
import { calcAccurateBpmAndOffset } from './../utils/bpm/analyzer';
import { setBpmAndOffset } from '../actions';

export default function* watcher() {
    yield takeEvery(ACTIONS.CALC_BPM, calcBpmAsync);
   // yield takeEvery(ACTIONS.PUSH_TRACK, calcBpmAsync);
}

function* calcBpmAsync(action) {
    const source = action.track.source;
    const id = action.track.sourceId;

    const api = getApi(source);
    const url = api.getUrl(id);

    // console.log(action)
    yield put(setBpmAndOffset(action.track.id, action.playlist, "calculating", null))
    let { offset, bpm } = yield call(calcAccurateBpmAndOffset, url);
    yield put(setBpmAndOffset(action.track.id, action.playlist, bpm, offset))

}

