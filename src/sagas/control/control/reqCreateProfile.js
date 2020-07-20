import { put, takeEvery } from "redux-saga/effects";
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import {ACTIONS, createProfile, pushLog} from "../../../actions";
import { Log } from "./../../../utils/logger/logger";

const path = ['saga', 'control', 'create new profile']

export default function* watcher(){
    yield takeEvery(ACTIONS.CONTROL_REQ_CREATE_PROFILE, handle)
}

function* handle(action){
    const {name, profileType} = action;

    // mock id
    const id =  ~~(Math.random() * 1000);

    try {
        yield put(showLoading())
        yield put(createProfile({id, name}));

        yield put(pushLog(new Log(`New midi profile created in database id: ${id}`, path)))
    } catch (error){
        yield put(pushLog(Log.Error(
            path,
            "Can't create new midi profile. :" + error.message,
            error
        )))
    } finally {
        yield put(hideLoading());
    }
}