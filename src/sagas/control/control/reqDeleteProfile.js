import { put, takeEvery, select } from "redux-saga/effects";
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import {ACTIONS, deleteControlProfile, pushLog} from "../../../actions";
import { Log } from "./../../../utils/logger/logger";
import {getApi} from "../../../apis/apiProvider";
import errorParser from "../../../utils/serverErrorParser/errorParser";

const path = ['saga', 'control', 'midi', 'delete control profile']

export default function* watcher(){
    yield takeEvery(ACTIONS.CONTROL_REQ_DELETE_PROFILE, handle)
}

const getToken = state => state.user.token

function* handle(action){
    const {profile} = action;
    const token = yield select(getToken);

    if(!token || !profile) return;
    try {
        yield put(showLoading());

        const { callQuery, queries } = getApi("UserAssets");
        const query = queries.deleteControlProfileQl;
        const response = yield callQuery(query, token , { id : profile.id })

        if (response.errors || !response.data.deleteControlProfile) {
            throw new Error("Server response contains errors " + errorParser(response.errors));
        }

        yield put(deleteControlProfile(profile));
        yield put(pushLog(new Log(`Control profile ${profile.id} deleted from database`, path)))
    } catch (error){
        yield put(pushLog(Log.Error(
            path,
            "Can't delete control profile from database :" + error.message,
            error
        )))
    } finally {
        yield put(hideLoading());
    }
}