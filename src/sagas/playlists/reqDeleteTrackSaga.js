import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, deleteTrack, pushLog } from "actions";
import { getApi } from "./../../apis/apiProvider";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";

export default function* deleteTrackRequestSaga() {
    yield takeEvery(ACTIONS.PL_DELETE_TRACK_REQUEST, handel)
}

const getToken = state => state.user.token;

function* handel(action) {
    const path = ['saga', 'playlist', 'request delete track'];
    const token = yield select(getToken);

    if (!token) {
        return yield put(deleteTrack(action.index));
    }
    try {
        yield put(showLoading());
        const { callQuery, queries } = getApi("UserAssets");
        let response = yield callQuery(queries.deleteQl.deleteTrack(action.id), token);

        if(response.errors){
            throw new Error('Server response contains errors '+ errorParser(response.errors))
        }
        if (!response.data.deleteTrack) {
            throw new Error();
        }

        yield put(deleteTrack(action.index));
        
        yield put(pushLog(new Log("Track deleted from database", path)))
    } catch (error) {
        yield put(pushLog(Log.Error(
            path,
            "Can't delete track" + error.message,
            "Sorry. During process deleting track occurred a problem",
            error
        )))
    } finally {
        yield put(hideLoading())
    }
}
