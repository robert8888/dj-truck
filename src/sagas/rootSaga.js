
import { takeEvery } from 'redux-saga/effects';
import { ACTIONS } from "../actions";
import ytSearchAsync from "./ytSearchSaga";
import calcBpmAsync from "./calcBpmSaga";


function* rootSaga(){
    yield takeEvery(ACTIONS.SEARCH_START, ytSearchAsync);
    yield takeEvery(ACTIONS.PUSH_TRACK, calcBpmAsync);
}

export default rootSaga;