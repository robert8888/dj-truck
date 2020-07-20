import { put, takeEvery } from "redux-saga/effects";
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import {ACTIONS, updateProfile, pushLog} from "../../../actions";
import { Log } from "./../../../utils/logger/logger";

const path = ['saga', 'control', 'midi', 'update midi profile']

export default function* watcher(){
    yield takeEvery(ACTIONS.CONTROL_REQ_UPDATE_PROFILE, handle)
}

function* handle(action){

    try {
        yield put(showLoading())

        const {profile} = action;

        yield put(updateProfile(profile));

        yield put(pushLog(new Log(`Midi profile  ${profile.id} update in database`, path)))
    } catch (error){
        yield put(pushLog(Log.Error(
            path,
            "Can't update midi profile" + error.message,
            error
        )))
    } finally {
        yield put(hideLoading());
    }
}