import { put, takeEvery, select } from "redux-saga/effects";
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import {ACTIONS, setControlProfile,setCurrentControlProfile , pushLog} from "../../../actions";
import { Log } from "./../../../utils/logger/logger";
import {getApi} from "../../../apis/apiProvider";
import errorParser from "../../../utils/serverErrorParser/errorParser";

const path = ['saga', 'control', 'midi', 'read profile list']

export default function* watcher(){
    yield takeEvery(ACTIONS.CONTROL_REQ_PROFILE, handle)
}

const getToken = state => state.user.token;

const getProfileMap = (state, id) => state.control.profiles[id]

function* handle(action){
    const token = yield select(getToken);
    const id = action.id;

    if(!token || !id) return;

    try {
        yield put(showLoading());
        const _profile = yield select(getProfileMap, id);
        if(_profile && _profile.map){
            return yield put(setCurrentControlProfile(_profile.id, _profile.type));
        }

        const { callQuery, queries } = getApi("UserAssets");
        const query = queries.getControlProfileQl;
        const response = yield callQuery(query, token, {id})
        const profile = response?.data?.controlProfile;

        if (response.errors || !profile) {
            throw new Error("Server response contains errors " + errorParser(response.errors));
        }

        yield put(setControlProfile(profile));

        yield put(pushLog(new Log(`Control profile list loaded from database`, path)))
    } catch (error){
        yield put(pushLog(Log.Error(
            path,
            "Can't read control profile" + error.message,
            error
        )))
    } finally {
        yield put(hideLoading());
    }
}