import { deleteTrack, ACTIONS } from "../../actions";
import { takeEvery, select, put } from "redux-saga/effects"
import { getApi } from "./../../apis/apiProvider";
import { showLoading, hideLoading } from 'react-redux-loading-bar'


export default function* deleteTrackRequestSaga() {
    yield takeEvery(ACTIONS.PL_DELETE_TRACK_REQUEST, handel)
}

const getToken = state => state.user.token;

function* handel(action) {
    const token = yield select(getToken);
    if (!token) {
        return yield put(deleteTrack(action.index));
    }
    try {
        yield put(showLoading());
        const { callQuery, queries } = getApi("UserAssets");
        let res = yield callQuery(queries.deleteQl.deleteTrack(action.id), token);
        if (!res.errors && res.data.deleteTrack) {
            yield put(deleteTrack(action.index));
        } else {
            throw new Error(JSON.stringify(res.errors))
        }

    } catch (err) {
        console.log("can't delete track in database, problem with api call");
        console.log(err.message);
    } finally {
        yield put(hideLoading())
    }
}
