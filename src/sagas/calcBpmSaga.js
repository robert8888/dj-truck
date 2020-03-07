
import { put , call} from 'redux-saga/effects';

import getApi from "./../apis/apiProvider";
import {calcBpm} from './../utils/bpm/analyzer';
import { setBpm } from '../actions';


export default function* calcBpmAsync(action){
    const source = action.track.source;
    const id = action.track.id;

    const api = getApi(source);
    const url = api.getUrl(id);

    let bpm = yield call(calcBpm , url);

    yield put(setBpm(source, id, bpm));

}

