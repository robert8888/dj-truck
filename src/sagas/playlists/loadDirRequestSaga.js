import {  ACTIONS, pushDirContent } from "../../actions";
import { takeEvery, select, put } from "redux-saga/effects"
import { getApi } from "./../../apis/apiProvider";
import requestDirContetQuery from "./../../qlQueries/requestDirContent";
import { get } from "lodash/object";

export default function* loadDirRequest() {
    yield takeEvery(ACTIONS.PL_LOAD_DIR_REQUEST, handel)
}

const getToken = state => state.user.token;

const getCurrentSelection = state => state.playList.currentSelection;

const getCurrent = (state, path) => get(state.playList, path);

export function* handel(action) {
    const { callQuery } = getApi("UserAssets");
    const token = yield select(getToken);
    const currentSelection = yield select(getCurrentSelection);
    const current = yield select(getCurrent, currentSelection);

    if (!current._loaded) {
        let dirContent = yield callQuery(requestDirContetQuery(current._id), token);
        if (!dirContent.data.dir) {
            return;
        }

        dirContent = dirContent.data.dir;
        const isRoot = false;
        yield put(pushDirContent(dirContent, isRoot, action.path, action.open));
    }
}

