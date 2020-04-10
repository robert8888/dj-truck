import { ACTIONS, openCurrentPlaylist, setCurretPlaylistContent } from "../../actions";
import { takeEvery, select, put, call } from "redux-saga/effects"
import { getApi } from "./../../apis/apiProvider";
import loadPlaylist from "./../../qlQueries/loadPlaylist";
import { get } from "lodash/object";

export default function* loadPlaylistRequest() {
    yield takeEvery(ACTIONS.PL_LOAD_CURRENT_PLAYLIST_REQUEST, handel)
}

const getToken = state => state.user.token;

const getCurrentPlaylistId = state => {
    const path = state.playList.currentSelection;
    return get(state.playList, path);
}

const getCurrent = (state, path) => get(state.playList, path);

export function* handel(action) {
    const { callQuery } = getApi("UserAssets");
    const token = yield select(getToken);
    const playlist = yield select(getCurrentPlaylistId);



    if (playlist._loaded) {
        return yield put(openCurrentPlaylist())
    } else {
        console.log("query", loadPlaylist(playlist._id))
        const result = yield call(function* fetch() {
            return yield callQuery(loadPlaylist(playlist._id), token)
        });

        if (result?.data?.playlist?.tracks?.length) {
            console.log("we have some tracks")
            yield put(setCurretPlaylistContent(result.data.playlist));
        }
        yield put(openCurrentPlaylist());
    }
}

