import { deleteSelected, ACTIONS } from "../../actions";
import { takeEvery, select, put } from "redux-saga/effects"
import { getApi } from "./../../apis/apiProvider";
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import { get } from "lodash/object";

export default function* deleteSelectedRequestSaga() {
    yield takeEvery(ACTIONS.PL_DELETE_SELECTED_REQUEST, handel)
}

const getToken = state => state.user.token;

const getCurrentSelection = state => state.playList.currentSelection;

const getCurrent = (state, path) => get(state.playList, path);

function* handel(action) {
    const token = yield select(getToken);
    if (!token) {
        return yield put(deleteSelected());
    }
    try {
        yield put(showLoading());
        const { callQuery, queries } = getApi("UserAssets");
        const currentSelection = yield select(getCurrentSelection);
        const current = yield select(getCurrent, currentSelection);

        const id = current._id;

        let query;
        if (current._type === "playlist") {
            query = queries.deleteQl.deletePlaylist([id], action.name)
        } else { // dir
            query = queries.deleteQl.deleteDir([id], action.name)
        }

        let res = yield callQuery(query, token);
        console.log(res)
        if (!res.errors) {
            let deletedRows = 0;
            if (current._type === "playlist") {
                deletedRows = res.data.deletePlaylist;
            } else {
                deletedRows = res.data.deleteDir;
            }
            if (deletedRows) {
                yield put(deleteSelected());
            }

        }
    } catch (err) {
        console.log("can't remove element in database, problem with api call");
        console.log(err.message);
    } finally {
        yield put(hideLoading())
    }
}

