import { put, takeEvery, select } from "redux-saga/effects";
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import {ACTIONS, setControlProfileList, pushLog, reqControlProfile} from "../../../actions";
import { Log } from "../../../utils/logger/logger";
import {getApi} from "../../../apis/apiProvider";
import errorParser from "../../../utils/serverErrorParser/errorParser";

const path = ['saga', 'control', 'midi', 'read profile list']

export default function* watcher(){
    yield takeEvery(ACTIONS.CONTROL_REQ_PROFILE_LIST, handle)
}

const getToken = state => state.user.token

function* handle(){
    const token = yield select(getToken);

    if(!token) return;

    try {
        yield put(showLoading())
        const { callQuery, queries } = getApi("UserAssets");
        const query = queries.getControlProfileListQl;
        const response = yield callQuery(query, token)

        if (response.errors) {
            throw new Error("Server response contains errors " + errorParser(response.errors));
        }

        yield put(setControlProfileList(response.data.controlProfileList));

        const currentMidiId = localStorage.getItem("currentMidiProfileId");
        const currentKbdId = localStorage.getItem("currentKbdProfileId");
        currentKbdId && (yield put(reqControlProfile(+currentKbdId)))
        currentMidiId && (yield put(reqControlProfile(+currentMidiId)));

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