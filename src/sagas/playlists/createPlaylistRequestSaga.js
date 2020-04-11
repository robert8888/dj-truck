import { createPlaylist, ACTIONS } from "../../actions";
import { takeEvery, select, put, call } from "redux-saga/effects"
import { getApi } from "./../../apis/apiProvider";
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import { generateTemplateName as generateName, findClosesDir } from "./../../reducers/console/playlist/utils";
import { get } from "lodash/object";
import { handel as loadDirSagaHanedl } from "./loadDirRequestSaga";
import UUID from "uuidjs"
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
            yield call(loadDirSagaHanedl, { path: parrentPath })
        }

        let result = yield callQuery(queries.createPlaylistQl(parrentDir._id, playlistName), token);
        if (!result || !result.data?.createPlaylist) {
            return;
        }
        var id = result.data.createPlaylist.id;

        renameMode = (action.renameMode !== undefined) ? action.renameMode : renameMode;

        yield put(createPlaylist(playlistName, id, renameMode, action.setCurrent));
    } catch (err) {
        console.log("can't crate playlist in database");
        console.log(err.message)
    } finally {
        yield put(hideLoading())
    }
    return id;
}

