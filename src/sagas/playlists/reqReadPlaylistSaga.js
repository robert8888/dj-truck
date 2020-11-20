import { get } from "lodash/object";
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { call, put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, openCurrentPlaylist, pushLog, setPlaylistContent } from "../../actions";
import { getApi } from "./../../apis/apiProvider";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";

export default function* loadPlaylistRequest() {
    yield takeEvery(ACTIONS.PL_LOAD_PLAYLIST_REQUEST, handle)
}

const getToken = state => state.user.token;

const getCurrentPlaylist = state => {
    const path = state.playList.currentSelection;
    return get(state.playList, path);
}

export function* handle(action) {
    const path = ['saga', 'playlist', 'request read playlist']

    const token = yield select(getToken);
    const playlist = yield select(getCurrentPlaylist);

    if (playlist._loaded || !token) {
        if(action.open)
            yield put(openCurrentPlaylist(action.path));
    } else {
        try {
            yield put(showLoading());
            const { callQuery, queries } = getApi("UserAssets");
            const response = yield call(function* fetch() {
                return yield callQuery(queries.loadPlaylistQl(playlist._id), token)
            });

   
            if(response.errors){
                throw new Error('Server response contains errors '+ errorParser(response.errors))
            }

            if(response?.data?.playlist?.tracks?.length){
                yield put(setPlaylistContent(response.data.playlist, action.path));
            }

            if(action.open){
                yield put(openCurrentPlaylist(action.path));
            }
            yield put(pushLog(new Log("Playlist successful read from database", path)))

            return response.data.playlist;
        } catch (error) {
            yield put(pushLog(Log.Error(
                path,
                "Can't read playlist" + error.message,
                "Sorry. During process loading playlist content occurred a problem",
                error
            )))
        } finally {
            yield put(hideLoading())
        }
    }
}

