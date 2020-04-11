import { moveTo, ACTIONS } from "../../actions";
import { takeEvery, select, put } from "redux-saga/effects";
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import { getApi } from "./../../apis/apiProvider";
import { get } from "lodash/object";

export default function* renameSelectedRequestSaga() {
    yield takeEvery(ACTIONS.PL_MOVE_TO_REQUEST, handle)
}

const getToken = state => state.user.token;

const getElement = (state, path) => get(state.playList, path);

const getTargetId = (state, path) => get(state.playList, path)._id;

function* handle(action) {
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

        let res = yield callQuery(query, token);

        if (!res.errors) {
           yield put(moveTo(action.pathFrom, action.pathTo))
        } else {
            throw new Error(JSON.stringify(res.errors))
        }
    } catch (err) {
        console.log("Can't update data in database. Api call problem");
        console.log(err.message);
    } finally{
      yield put(hideLoading())
    }
}

