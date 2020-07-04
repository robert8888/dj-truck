import { put, takeEvery, select } from "redux-saga/effects";
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import {ACTIONS, deleteMidiProfile, pushLog} from "../../../actions";
import { Log } from "./../../../utils/logger/logger";

const path = ['saga', 'control', 'midi', 'delete new profile']

export default function* watcher(){
    yield takeEvery(ACTIONS.C_MIDI_REQ_DELETE_PROFILE, handle)
}

const currentProfile = state => {
    const id = state.midi.currentProfileId;
    return state.midi.profiles.find( p => p.id === id);
}

function* handle(action){

    //const {profile: {id}} =  action //

    try {
        yield put(showLoading());

        const profile = yield select(currentProfile);
        if(!profile) return;

        yield put(deleteMidiProfile(profile));
        yield put(pushLog(new Log(`Midi profile ${profile.id} deleted from database`, path)))
    } catch (error){
        yield put(pushLog(Log.Error(
            path,
            "Can't delete profile from database :" + error.message,
            error
        )))
    } finally {
        yield put(hideLoading());
    }
}