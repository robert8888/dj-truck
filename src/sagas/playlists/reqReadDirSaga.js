import { get } from "lodash/object";
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, pushDirContent, pushLog } from "../../actions";
import { getApi } from "./../../apis/apiProvider";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";

export default function* readDirRequest() {
    yield takeEvery(ACTIONS.PL_LOAD_DIR_REQUEST, handle)
}

const getToken = state => state.user.token;

const getCurrentSelection = state => state.playList.currentSelection;

const getCurrent = (state, path) => get(state.playList, path);

export function* handle(action) {
    const path = ['saga', 'playlist', 'request read dir'];

    const token = yield select(getToken);
    const currentSelection = yield select(getCurrentSelection);
    const current = yield select(getCurrent, currentSelection);

    if (!current._loaded && token) {
        try {
            yield put(showLoading());
            const { callQuery, queries } = getApi("UserAssets");
            let response = yield callQuery(queries.loadDirContentQl(current._id), token);

            if(response.errors){
                throw new Error('Server response contains errors '+ errorParser(response.errors))
            }

            if (!response.data.dir) {
                return;
            }

            const dir = response.data.dir;
            const isRoot = false;

            yield put(pushDirContent(dir, isRoot, action.path, action.open));

            yield put(pushLog(new Log("Dir sucessful readed from database", path)))
        } catch (error) {
            yield put(pushLog(Log.Error(
                path,
                "Can't read dir" + error.message,
                "Sorry. During process reading dir content occurred a problem",
                error
            )))
        } finally {
            yield put(hideLoading())
        }
    }
}

