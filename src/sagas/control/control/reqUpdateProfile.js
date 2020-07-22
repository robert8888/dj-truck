import {put, select, takeEvery} from "redux-saga/effects";
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import {ACTIONS, updateControlProfile, pushLog} from "../../../actions";
import { Log } from "./../../../utils/logger/logger";
import {getApi} from "../../../apis/apiProvider";
import errorParser from "../../../utils/serverErrorParser/errorParser";

const path = ['saga', 'control', 'midi', 'update control profile']

export default function* watcher(){
    yield takeEvery(ACTIONS.CONTROL_REQ_UPDATE_PROFILE, handleUpdateName)
    yield takeEvery(ACTIONS.CONTROL_SET_MAPPING_STATE, handleUpdateMap )
}

const getToken = state => state.user.token

function* handleUpdateName(action){
    const {profile} = action;
    const token = yield select(getToken);

    if(!token || !profile) return;

    try {
        yield put(showLoading())

        const { callQuery, queries } = getApi("UserAssets");
        const query = queries.updateControlProfileQl;
        const response = yield callQuery(query, token, {...profile})

        if (response.errors || !response.data.updateControlProfile) {
            throw new Error("Server response contains errors " + errorParser(response.errors));
        }

        yield put(updateControlProfile(profile));

        yield put(pushLog(new Log(`Control profile  ${profile.id} update in database`, path)))
    } catch (error){
        yield put(pushLog(Log.Error(
            path,
            "Can't update control profile name" + error.message,
            error
        )))
    } finally {
        yield put(hideLoading());
    }
}


const getCurrentMidiProfileId = state => state.control.currentMidiProfileId;
const getCurrentKbdProfileId = state => state.control.currentKbdProfileId;
const getProfile = (state, id) => state.control.profiles[id];

let lastMappingMode;

function* handleUpdateMap(action){
    const {value : currentMappingMode} = action;
    const token = yield select(getToken);

    if(currentMappingMode){
        lastMappingMode = currentMappingMode
    }
    if(!token || currentMappingMode) return;

    try {
         yield put(showLoading())

        let id = null
        if(lastMappingMode === "midi"){
            id = yield select(getCurrentMidiProfileId);
        } else if(lastMappingMode === "kbd"){
            id = yield select(getCurrentKbdProfileId);
        }

        const  profile = yield select(getProfile, id);
        const vars = {};
        vars.id = profile.id;
        vars.map = Object.entries(profile.map.toAction)
            .map(([key, value]) => ({
                key,
                value,
            }))


        const { callQuery, queries } = getApi("UserAssets");
        const query = queries.updateControlProfileMapQl;
        const response = yield callQuery(query, token, {...vars})

        console.log(response)
        if (response.errors || !response?.data?.updateControlProfileMap) {
            throw new Error("Server response contains errors " + errorParser(response.errors));
        }

         yield put(pushLog(new Log(`Control profile  ${profile.id} update in database`, path)))
    } catch (error){
        yield put(pushLog(Log.Error(
            path,
            "Can't update control profile map" + error.message,
            error
        )))
    } finally {
        yield put(hideLoading());
    }
}


