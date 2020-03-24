
import { put , call} from 'redux-saga/effects';

import getApi from "./../apis/apiProvider";
import {calcAccurateBpmAndOffset} from './../utils/bpm/analyzer';
import {  setBpmAndOffset } from '../actions';


export default function* calcBpmAsync(action){
    const source = action.track.source;
    const id = action.track.id;

    const api = getApi(source);
    const url = api.getUrl(id);

    let { offset, bpm } = yield call( calcAccurateBpmAndOffset, url);
    yield put(setBpmAndOffset(source, id, bpm, offset))

}

