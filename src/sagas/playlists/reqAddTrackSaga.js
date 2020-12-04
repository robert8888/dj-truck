import { get } from "lodash/object";
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { call, put, select, takeEvery } from "redux-saga/effects";
import UUID from "uuidjs";
import { ACTIONS, pushLog, pushTrackToList, startCalcBpm } from "../../actions";
import { getApi } from "./../../apis/apiProvider";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";
import { formater } from "./../../utils/time/timeFromater";
import { handle as createNewPlaylist } from "./reqCreatePlaylistSaga";

export default function* pushTrackToListSaga() {
    yield takeEvery(ACTIONS.PL_PUSH_TRACK_REQUEST, handle)
}

const getToken = state => state.user.token;

const getPlaylistPath = state => state.playList.currentPlaylist;

const getCurrent = (state, path) => get(state.playList, state.playList.currentPlaylist);

function* handle(action) {
    const path = ['saga', 'playlist', 'request add track to playlist'];
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
        let playlistId = currentPlaylist?._id;
        let playlistLength = currentPlaylist?._content?.length;

        if (!playlistId) {
            playlistId = yield call(createNewPlaylist, { setCurrent: true, renameMode: false });
            playlistLength = 0;
        }

        const response = yield callQuery(queries.createTrackQl, token, {
            playlist: playlistId,
            title: action.track.title,
            source: action.track.source,
            sourceId: action.track.sourceId.toString(),
            quality: action.track.quality,
            duration: (typeof action.track.duration === "string") ?
                formater.ytToSeconds(action.track.duration) :
                action.track.duration,
            thumbnails: action.track.thumbnails,
            position: playlistLength,
        });

        if(response.errors){
            throw new Error('Server response contains errors '+ errorParser(response.errors))
        }

        const trackId = response.data.createTrack.id;
        yield put(pushTrackToList({
            ...action.track,
            id: trackId
        }, action.playlist));

        yield put(pushLog(
            new Log(`Added track id:${action.track.id}to playlist id:${playlistId} successful`, path)
        ))
    } catch (error) {
        yield put(pushLog(Log.Error(
            path,
            "Can't track to playlist " + error.message,
            "Sorry. During process of adding track to playlist occurred a problem",
            error
        )))
    } finally {
        yield put(hideLoading())
    }
}

