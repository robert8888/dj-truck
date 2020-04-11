import { ACTIONS, openCurrentPlaylist, setPlaylistContent } from "../../actions";
import { takeEvery, select, put, call } from "redux-saga/effects"
import { getApi } from "./../../apis/apiProvider";
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import { get } from "lodash/object";

export default function* loadPlaylistRequest() {
    yield takeEvery(ACTIONS.PL_LOAD_PLAYLIST_REQUEST, handel)
}

const getToken = state => state.user.token;

const getCurrentPlaylist = state => {
    const path = state.playList.currentSelection;
    return get(state.playList, path);
}

export function* handel(action) {
    const token = yield select(getToken);
    const playlist = yield select(getCurrentPlaylist);

    if (playlist._loaded || !token) {
        return yield put(openCurrentPlaylist(action.path))
    } else {
        try {
            yield put(showLoading());
            const { callQuery, queries } = getApi("UserAssets");
            const result = yield call(function* fetch() {
                return yield callQuery(queries.loadPlaylistQl(playlist._id), token)
            });

            if (!result.errors && result?.data?.playlist?.tracks?.length) {
                yield put(setPlaylistContent(result.data.playlist, action.path));
            } else if (result.errors) {
                throw new Error(JSON.stringify(result.errors));
            }
            yield put(openCurrentPlaylist(action.path));
        } catch (err) {
            console.log("connectin to api problem");
            console.log(err.message);
        } finally {
            yield put(hideLoading())
        }
    }
}

