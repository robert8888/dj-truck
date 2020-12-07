import { put, takeEvery, select } from "redux-saga/effects";
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import {ACTIONS, createControlProfile, pushLog} from "actions";
import { Log } from "./../../../utils/logger/logger";
import {getApi} from "../../../apis/apiProvider";
import errorParser from "../../../utils/serverErrorParser/errorParser";

const path = ['saga', 'control', 'create new profile']

export default function* watcher(){
    yield takeEvery(ACTIONS.CONTROL_REQ_CREATE_PROFILE, handle)
}

const getToken = state => state.user.token

function* handle(action){
    const {name, profileType} = action;
    const token = yield select(getToken);

    if(!token || !profileType || !name) return;

    try {
        yield put(showLoading())
        const { callQuery, queries } = getApi("UserAssets");
        const query = queries.createControlProfileQl;
        const response = yield callQuery(query, token , { name, type: profileType })

        if (response.errors) {
            throw new Error("Server response contains errors " + errorParser(response.errors));
        }
        const profile = response.data.createControlProfile

        yield put(createControlProfile(profile));

        yield put(pushLog(new Log(`New control profile created in database id: ${profile.id}`, path)))
    } catch (error){
        yield put(pushLog(Log.Error(
            path,
            "Can't create new control profile. :" + error.message,
            error
        )))
    } finally {
        yield put(hideLoading());
    }
}