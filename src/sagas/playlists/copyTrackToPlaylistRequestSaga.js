import {  ACTIONS } from "../../actions";
import { takeEvery, select, put, fork } from "redux-saga/effects"
import { getApi } from "./../../apis/apiProvider";
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import { get } from "lodash/object";
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

        const result = yield callQuery(queries.createTrackQl, token, {
            playlist: playlistId,
            title: action.track.title,
            source: action.track.source,
            sourceId: action.track.sourceId,
            quality: action.track.quality,
            bpm: action.track.bpm,
            offset: action.track.offset,
            duration: (typeof action.track.duration === "string") ?
                formater.ytToSeconds(action.track.duration) :
                action.track.duration,
            thumbnails: action.track.thumbnails,
            position: playlistLength,
        });

        console.log(result)
        if (result.errors){
            throw new Error(JSON.stringify(result.errors))
        }

    } catch (err) {
        console.log("Can't push track to playlist in database");
        console.log(err.message);
    } finally {
        yield put(hideLoading())
    }
}

