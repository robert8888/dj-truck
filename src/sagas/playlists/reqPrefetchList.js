
import { takeEvery, select, call, put } from "redux-saga/effects";
import { ACTIONS, pushLog, pushNotification } from "../../actions";
import _get from "lodash/get";
import {getApi} from "../../apis/apiProvider";
import {handle as loadPlaylist} from "./reqReadPlaylistSaga";
import {cacheFromUrls} from "../../utils/bpm/audioCache";
import {Log} from "../../utils/logger/logger";

export default function* renameSelectedRequestSaga() {
    yield takeEvery(ACTIONS.PL_PREFETCH_PLAYLIST, handle)
}

const selectCurrentSelection = (state) => state.playList.currentSelection;

const selectCurrentPlaylistContent = (state, playlistPath) => {
    return _get(state.playList, playlistPath || state.playList.currentSelection)
}

const getUrls = (playlist) =>{
    return playlist._content.map(track => {
        const api = getApi(track.source);
        return api.getUrl(track.sourceId)
    })
}

function* handle(action){
    const currentSelected = yield select(selectCurrentSelection)
    try {
        let {playlist} = action;
        if (!playlist) {
            playlist = yield select(selectCurrentPlaylistContent)
        } else {
            playlist = yield select(selectCurrentPlaylistContent, playlist)
        }
        if (!playlist._loaded) {
            const content = yield call(loadPlaylist, {path: currentSelected})
            playlist._content = content.tracks;
        }
        const urls = getUrls(playlist);
        yield put(pushNotification({
            data: {
                title: "Pre fetching tracks",
                content: `Downloading ${urls.length} tracks from playlist: ${currentSelected[currentSelected.length - 1]} in progress`
            }
        }))

        const cached = yield call(cacheFromUrls, urls)
        const stored = cached.reduce((acc, cur) => {
            return acc + (cur.stored.type.startsWith("audio") ? 1 : 0)
        }, 0)
        const amount = stored === cached.length ? "All" : stored;

        yield put(pushNotification({
            data: {
                title: "Success",
                content: `${amount} tracks from playlist: ${currentSelected[currentSelected.length - 1]} are stored on your local disk`
            },
            timeout: 5_000
        }))
    } catch(error) {
        yield put(pushNotification({
            data: {
                title: "Fail",
                content: `Unable download tracks from playlist: ${currentSelected[currentSelected.length - 1]} to local disk`
            },
            timeout: 5_000
        }))
        yield put(pushLog(Log.Error(
            ["saga", "request pre fetch list"],
            "Unable download tracks from playlist" + error.message,
        )))
    }
}



