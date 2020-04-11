import { ACTIONS, pushDirContent } from "../../actions";
import { takeEvery, select, put } from "redux-saga/effects"
import { getApi } from "./../../apis/apiProvider";
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import { get } from "lodash/object";

export default function* loadDirRequest() {
    yield takeEvery(ACTIONS.PL_LOAD_DIR_REQUEST, handel)
}

const getToken = state => state.user.token;

const getCurrentSelection = state => state.playList.currentSelection;

const getCurrent = (state, path) => get(state.playList, path);

export function* handel(action) {
    const token = yield select(getToken);
    const currentSelection = yield select(getCurrentSelection);
    const current = yield select(getCurrent, currentSelection);

    if (!current._loaded && token) {
        try {
            yield put(showLoading());
            const { callQuery, queries } = getApi("UserAssets");
            let dirContent = yield callQuery(queries.loadDirContentQl(current._id), token);
            if (!dirContent.data.dir) {
                return;
            }

            dirContent = dirContent.data.dir;
            const isRoot = false;
            yield put(pushDirContent(dirContent, isRoot, action.path, action.open));
        } catch (err) {
            console.log("can't load dir from api");
            console.log(err.message);
        } finally {
            yield put(hideLoading())
        }
    }
}

