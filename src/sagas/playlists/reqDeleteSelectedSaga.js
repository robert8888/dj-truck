import { get } from "lodash/object";
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, deleteSelected, pushLog } from "../../actions";
import { getApi } from "./../../apis/apiProvider";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";

export default function* deleteSelectedRequestSaga() {
    yield takeEvery(ACTIONS.PL_DELETE_SELECTED_REQUEST, handel)
}

const getToken = state => state.user.token;

const getCurrentSelection = state => state.playList.currentSelection;

const getCurrent = (state, path) => get(state.playList, path);

function* handel(action) {
    const path = ['saga', 'playlist', 'request delete selected'];
    const token = yield select(getToken);

    if (!token) {
        return yield put(deleteSelected());
    }
    try {
        yield put(showLoading());
        const { callQuery, queries } = getApi("UserAssets");
        const currentSelection = yield select(getCurrentSelection);

        if(currentSelection.length <= 1) // prevent to deleting root dir
            return;

        const current = yield select(getCurrent, currentSelection);

        const id = current._id;

        let query;
        if (current._type === "playlist") {
            query = queries.deleteQl.deletePlaylist([id], action.name)
        } else { // dir
            query = queries.deleteQl.deleteDir([id], action.name)
        }

        let response = yield callQuery(query, token);
        if(response.errors){
            throw new Error('Server response contains errors '+ errorParser(response.errors))
        }

        let deletedRows = 0;
        deletedRows = (current._type === "playlist")  ? 
                      response.data.deletePlaylist : 
                      response.data.deleteDir;

        if (deletedRows) {
            yield put(deleteSelected());
        }

        yield put(pushLog(new Log(`Current seleted ${current._type} deleted from database.`, path)))
    } catch (error) {
        yield put(pushLog(Log.Error(
            path,
            "Can't delete current seleted element" + error.message,
            "Sorry. During process deleting element occurred a problem",
            error
        )))
    } finally {
        yield put(hideLoading())
    }
}

