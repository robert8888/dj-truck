import { pushTrackToList, ACTIONS, startCalcBpm } from "../../actions";
import { takeEvery, select, put, call } from "redux-saga/effects"
import { getApi } from "./../../apis/apiProvider";
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import { get } from "lodash/object";
import { handle as createNewPlaylist } from "./createPlaylistRequestSaga";
import UUID from "uuidjs";
import { formater } from "./../../utils/time/timeFromater";

export default function* pushTrackToListSaga() {
    yield takeEvery(ACTIONS.PL_PUSH_TRACK_REQUEST, handle)
}

const getToken = state => state.user.token;

const getPlaylistPath = state => state.playList.currentPlaylist;

const getCurrent = (state, path) => get(state.playList, state.playList.currentPlaylist);

function* handle(action) {

    const token = yield select(getToken);
    if (!token) {
        action.track.id = UUID.genV1().toString();
        yield put(pushTrackToList(action.track, action.playlist));
        yield put(startCalcBpm(action.track, action.playlist));
        return;
    }

    try {
        yield put(showLoading());
        const { callQuery, queries } = getApi("UserAssets");
        const currentPlaylist = yield select(getCurrent);
        let playlistId = currentPlaylist._id;
        let playlistLength = currentPlaylist._content.length;

        if (!playlistId) {
            playlistId = yield call(createNewPlaylist, { setCurrent: true, renameMode: false });
            playlistLength = 0;
        }

        const result = yield callQuery(queries.createTrackQl, token, {
            playlist: playlistId,
            title: action.track.title,
            source: action.track.source,
            sourceId: action.track.sourceId,
            quality: action.track.quality,
            duration: (typeof action.track.duration === "string") ?
                formater.ytToSeconds(action.track.duration) :
                action.track.duration,
            thumbnails: action.track.thumbnails,
            position: playlistLength,
        });

        if (!result.errors) {

            const trackId = result.data.createTrack.id;
            yield put(pushTrackToList({
                ...action.track,
                id: trackId
            }, action.playlist));

            const currentPlaylistPath = yield select(getPlaylistPath);
            action.track.id = trackId;
            yield put(startCalcBpm(action.track, currentPlaylistPath));

        } else {
            throw new Error(JSON.stringify(result.errors))
        }
 
    } catch (err) {
        console.log("Can't push track to playlist in database");
        console.log(err.message);
    } finally {
        yield put(hideLoading())
    }
}

