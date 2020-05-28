import { get } from "lodash/object";
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { fork, put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, pushLog } from "../../actions";
import { getApi } from "./../../apis/apiProvider";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";
import { formater } from "./../../utils/time/timeFromater";

export default function* copyTrackToListSaga() {
    yield takeEvery(ACTIONS.PL_COPY_TRACK_TO_LIST, forkHandle)
    function* forkHandle(action){
        yield fork(handle, action)
    }
}

const getToken = state => state.user.token;

const getPlaylist = (state, path) => get(state.playList, path);

function* handle(action) {
    const path = ['saga', 'playlist', 'request copy'];
    const token = yield select(getToken);
    if (!token) {
        return;
    }
    try {
        yield put(showLoading());
        const { callQuery, queries } = getApi("UserAssets");
        const playlist = yield select(getPlaylist, action.path);
        let playlistId = playlist._id;
        let playlistLength = playlist._content.length;

        if(!playlistId){
            throw new Error("Internal error - playlist id not found")
        }

        console.e.log("before calling")
        const response = yield callQuery(queries.createTrackQl, token, {
            playlist: playlistId,
            title: action.track.title,
            source: action.track.source,
            sourceId: action.track.sourceId.toString(),
            quality: action.track.quality,
            bpm: (action.bpm === 'calculating') ? 0 : action.track.bpm,
            offset: action.track.offset,
            duration: (typeof action.track.duration === "string") ?
                formater.ytToSeconds(action.track.duration) :
                action.track.duration,
            thumbnails: action.track.thumbnails,
            position: playlistLength,
        });
        console.log(response)

        if(response.errors){
            throw new Error('Server response contains errors '+ errorParser(response.errors))
        }

        yield put(pushLog(
                new Log(`Copy track id:${action.track.id}to playlist id:${playlistId} successful`, path)
            ))
    } catch (error) {
        yield put(pushLog(Log.Error(
            path,
            "Can't copy trakc " + error.message,
            "Sorry. During process of coping track to playlist occurred a problem",
            error
        )))
    } finally {
        yield put(hideLoading())
    }
}

