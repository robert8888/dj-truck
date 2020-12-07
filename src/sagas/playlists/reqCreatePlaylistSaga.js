import { get } from "lodash/object";
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { call, put, select, takeEvery } from "redux-saga/effects";
import UUID from "uuidjs";
import { ACTIONS, createPlaylist, pushLog } from "actions";
import { getApi } from "./../../apis/apiProvider";
import { findClosesDir, generateTemplateName as generateName } from "./../../reducers/console/playlist/utils";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";
import { handle as readDirSagaHandle } from "./reqReadDirSaga";

export default function* createDirRequestSaga() {
    yield takeEvery(ACTIONS.PL_CREATE_PLAYLIST_REQUEST, handle)
}

const getToken = state => state.user.token;

const getCurrentSelection = state => state.playList.currentSelection;

const getParentPath = (state, currentSelection) =>
    findClosesDir(state, currentSelection)

const generatePlaylistName = (state, parrentPath, base) =>
    generateName(state.playList, parrentPath, base);

const getParrentDir = (state, path) => get(state.playList, path);

export function* handle(action) {
    const path = ['saga', 'playlist', 'request create playlist'];
    const token = yield select(getToken);

    let renameMode = false;
    if (!token) {
        if (!action.name) {
            renameMode = true;
        }
        return yield put(action.name, UUID.getV1().toString(), renameMode, true);
    }
    try {
        yield put(showLoading());
        const { callQuery, queries } = getApi("UserAssets");
        const currentSelection = yield select(getCurrentSelection);
        const parrentPath = yield select(getParentPath, currentSelection);

        let playlistName;
        if (!action.name) {
            playlistName = yield select(generatePlaylistName, parrentPath, "New playlist");
            renameMode = true;
        } else {
            playlistName = yield select(generatePlaylistName, parrentPath, action.name);
        }

        const parrentDir = yield select(getParrentDir, parrentPath);
        if (!parrentDir._loaded) {
            yield call(readDirSagaHandle, { path: parrentPath })
        }

        let response = yield callQuery(queries.createPlaylistQl(parrentDir._id, playlistName), token);

        if(response.errors){
            throw new Error('Server response contains errors '+ errorParser(response.errors))
        }

        if (!response.data?.createPlaylist) {
            throw new Error()
        }
        
        var id = response.data.createPlaylist.id;

        renameMode = (action.renameMode !== undefined) ? action.renameMode : renameMode;

        yield put(createPlaylist(playlistName, id, renameMode, action.setCurrent));

        yield put(pushLog(new Log(`Creating playlist in database successful id: ${id}`, path)))
    } catch (error) {
        yield put(pushLog(Log.Error(
            path,
            "Can't create playlist in database" + error.message,
            "Sorry. During process creating playlist occurred a problem",
            error
        )))
    } finally {
        yield put(hideLoading())
    }

    return id;
}

