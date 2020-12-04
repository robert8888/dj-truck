
import { takeEvery, select, call, put } from "redux-saga/effects";
import {ACTIONS, pushLog, pushNotification, setCacheState} from "../../actions";
import _get from "lodash/get";
import {getApi} from "../../apis/apiProvider";
import {handle as loadPlaylist} from "./reqReadPlaylistSaga";
import {cacheTracks} from "../../utils/bpm/audioCache";
import {Log} from "../../utils/logger/logger";

export default function* renameSelectedRequestSaga() {
    yield takeEvery(ACTIONS.PL_PREFETCH_PLAYLIST, handle)
}

const selectCurrentSelection = (state) => state.playList.currentSelection;

const selectCurrentPlaylistContent = (state, playlistPath) => {
    return _get(state.playList, playlistPath || state.playList.currentSelection)
}

const getTracks = (playlist) =>{
    return playlist._content.map(track => {
        const api = getApi(track.source);
        return {
            url: api.getUrl(track.sourceId),
            id: track.id,
        }
    })
}

function* handle(action){
    const path = ["saga", "request cache playlist"];
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
        const tracks = action.tracks || getTracks(playlist);
        yield put(pushNotification({
            data: {
                title: "Caching tracks",
                content: `Downloading ${tracks.length} tracks from playlist: ${currentSelected[currentSelected.length - 1]} in progress`
            }
        }))

        const cached = yield call(cacheTracks, tracks)

        const cachedTracks = cached.map(track => ({
            id: track.id,
            cached: track.store.data.type.startsWith(("audio"))
        }))

        const storedLength = cachedTracks.reduce((acc, cur) => {
            return acc + +cur.cached
        }, 0)
        const amount = storedLength === cached.length ? "All requested" : storedLength;

        yield put(setCacheState(currentSelected, cachedTracks))

        yield put(pushNotification({
            data: {
                title: "Success",
                content: `${amount} tracks from playlist: ${currentSelected[currentSelected.length - 1]} are stored on your local disk`
            },
            timeout: 5_000
        }))

        yield put(pushLog(
            new Log(`Cached tracks ids:${tracks.map(track => track.id).join()}to local cache`, path)
        ))
    } catch(error) {
        yield put(pushNotification({
            data: {
                title: "Fail",
                content: `Unable download tracks from playlist: ${currentSelected[currentSelected.length - 1]} to local disk`
            },
            timeout: 5_000
        }))
        yield put(pushLog(Log.Error(path,
            "Unable download tracks from playlist" + error.message,
        )))
    }
}



