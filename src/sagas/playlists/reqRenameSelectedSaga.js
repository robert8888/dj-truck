import { get } from "lodash/object";
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, pushLog, renameSelected } from "actions";
import { getApi } from "./../../apis/apiProvider";
import { findClosesDir, generateTemplateName as generateName } from "./../../reducers/console/playlist/utils";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";

export default function* renameSelectedRequestSaga() {
    yield takeEvery(ACTIONS.PL_RENAME_SELECTED_REQUEST, callApi)
}

const getToken = state => state.user.token;

const getCurrentSelection = state => state.playList.currentSelection;

const getCurrent = (state, path) => get(state.playList, path);

const parentDirPath = (state, path) => findClosesDir(state.playList, path);

const parseName = (state, path, name) => generateName(state.playList, path, name);

function* callApi(action) {
    const path = ['saga', 'playlist', 'request rename selected element']

    const token = yield select(getToken);
    if (!token) {
        yield put(renameSelected(action.name));
        return;
    }
    try {
        yield put(showLoading());
        const { callQuery, queries } = getApi("UserAssets");
        const currentSelection = yield select(getCurrentSelection);
        const current = yield select(getCurrent, currentSelection);
        const parentPath = yield select(parentDirPath, currentSelection);

        const id = current._id;
        const isPlaylist = (current._type === "playlist");

        const name = yield select(parseName, parentPath, action.name)

        if (!id) {
            throw new Error("Element id missing")
        }

        let query;
        if (isPlaylist) {
            query = queries.renameQl.renamePlaylist(id, name)
        } else { // dir
            query = queries.renameQl.renameDir(id, name)
        }

        let response = yield callQuery(query, token);
        
        if(response.errors){
            throw new Error('Server response contains errors '+ errorParser(response.errors))
        }

        yield put(renameSelected(name));

        yield put(pushLog(new Log(
                `Renamed selected ${isPlaylist ? "playlist" : "dir"} succesful id:` + id,
                path)
             ))
    } catch (error) {
        yield put(pushLog(Log.Error(
            path,
            "Can't rename selected" + error.message,
            "Sorry. During process renaming occurred a problem",
            error
        )))
    } finally{
      yield put(hideLoading())
    }
}

