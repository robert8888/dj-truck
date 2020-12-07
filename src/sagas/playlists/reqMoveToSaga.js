import { get } from "lodash/object";
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, moveTo, pushLog } from "actions";
import { getApi } from "./../../apis/apiProvider";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";

export default function* renameSelectedRequestSaga() {
    yield takeEvery(ACTIONS.PL_MOVE_TO_REQUEST, handle)
}

const getToken = state => state.user.token;

const getElement = (state, path) => get(state.playList, path);

const getTargetId = (state, path) => get(state.playList, path)._id;

function* handle(action) {
    const path = ['saga', 'playlist', 'request move element to'];
    const token = yield select(getToken);
    
    if (!token) {
        yield put(moveTo(action.pathFrom, action.pathTo));
        return;
    }
    try {
        yield put(showLoading());
        const { callQuery, queries } = getApi("UserAssets");
        const element = yield select(getElement, action.pathFrom);
        const targetId = yield select(getTargetId, action.pathTo);
        let query;
        if(element._type === "dir"){
            query = queries.moveQl.moveDir(element._id, targetId);
        } else if(element._type === "playlist"){
            query = queries.moveQl.movePlaylist(element._id, targetId);
        }

        let response = yield callQuery(query, token);

        if(response.errors){
            throw new Error('Server response contains errors '+ errorParser(response.errors))
        }


        yield put(moveTo(action.pathFrom, action.pathTo))
    
        yield put(pushLog(
                new Log(`Element sucessful moved el:${element._id} target: ${targetId}`, path)
            ))
    } catch (error) {
        yield put(pushLog(Log.Error(
            path,
            "Can't move seletcted element to" + error.message,
            "Sorry. During process moving element occurred a problem",
            error
        )))
    } finally{
      yield put(hideLoading())
    }
}

