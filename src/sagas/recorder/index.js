import {all} from "redux-saga/effects";
import stopAllSaga from "./onStopAllSaga";
import requestCreatedRecordSaga from "./reqCreateRecord";
import requestUpdateRecordSaga from "./reqUpdateRecord";
import tracklistSagas from './tracklist/tracklistRootSaga';

export default function * recorderRoot(){
    yield all([
        requestCreatedRecordSaga(),
        requestUpdateRecordSaga(),
        stopAllSaga(),
        tracklistSagas(), // recorder intercept adding track to record
    ])
}