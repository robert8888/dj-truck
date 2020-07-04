import { put, takeEvery } from "redux-saga/effects";
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import {ACTIONS, setMidiProfile, pushLog} from "../../../actions";
import { Log } from "./../../../utils/logger/logger";

const path = ['saga', 'control', 'midi', 'read profile']

export default function* watcher(){
    yield takeEvery(ACTIONS.C_MIDI_REQ_PROFILE, handle)
}

function* handle(action){

    const {id} =  action //

    try {
        yield put(showLoading())

        //mock profile
        const profile = {
            id,
            name: "Mockup profile",
            map : []
        }

        yield put(setMidiProfile(profile));

        yield put(pushLog(new Log(`Midi profile  ${id} loaded from database`, path)))
    } catch (error){
        yield put(pushLog(Log.Error(
            path,
            "Can't delete midi profile" + error.message,
            error
        )))
    } finally {
        yield put(hideLoading());
    }
}