import { deleteSelected, ACTIONS } from "../../actions";
import { takeEvery, select, put } from "redux-saga/effects"
import { getApi } from "./../../apis/apiProvider";
import { deleteDir, deletePlaylist } from "./../../qlQueries/delete";
import { get } from "lodash/object";

export default function* deleteSelectedRequestSaga() {
    yield takeEvery(ACTIONS.PL_DELETE_SELECTED_REQUEST, handel)
}

const getToken = state => state.user.token;

const getCurrentSelection = state => state.playList.currentSelection;

const getCurrent = (state, path) => get(state.playList, path);

function* handel(action) {
    const { callQuery } = getApi("UserAssets");
    const token = yield select(getToken);
    const currentSelection = yield select(getCurrentSelection);
    const current = yield select(getCurrent, currentSelection);

    const id = current._id;
    const isPlaylist = current instanceof Array;

    let query;
    if (isPlaylist) {
        query = deletePlaylist([id], action.name)
    } else { // dir
        query = deleteDir([id], action.name)
    }
    
    let res = yield callQuery(query, token);
    
    if (res) {
        yield put(deleteSelected());
    }
}

