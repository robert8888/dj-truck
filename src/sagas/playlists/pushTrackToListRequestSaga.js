import { pushTrackToList, ACTIONS, startCalcBpm } from "../../actions";
import { takeEvery, select, put, call } from "redux-saga/effects"
import { getApi } from "./../../apis/apiProvider";
import createTrackQuery from "./../../qlQueries/createTrack";
import { generateTemplateName as generateName, findClosesDir } from "./../../reducers/console/playlist/utils";
import { get } from "lodash/object";
import { handle as createNewPlaylist } from "./createPlaylistRequestSaga";
import UUID from "uuidjs";
import foramter, { formater } from "./../../utils/time/timeFromater";

export default function* pushTrackToListSaga() {
    yield takeEvery(ACTIONS.PL_PUSH_TRACK_REQUEST, handle)
}

const getToken = state => state.user.token;

const getCurrent = state => state.playList.list;

const getPlaylistPath = state => state.playList.currentPlaylist;

function* handle(action) {
    const { callQuery } = getApi("UserAssets");
    const token = yield select(getToken);

    const currentPlaylist = yield select(getCurrent);
    let playlistId = currentPlaylist._id;
    let playlistLength = currentPlaylist.length;

    if (!playlistId) {
        //create new 
        playlistId = yield call(createNewPlaylist, { setCurrent: true , renameMode:false});
        playlistLength = 0;
    }


    const result = yield callQuery(createTrackQuery, token, {
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
    console.log("result of query", result);
    if (!result.errors) {
        const trackId = result.data.createTrack.id;
        yield put(pushTrackToList({
            ...action.track,
            id: trackId
        }, action.playList));

        const currentPlaylistPath = yield select(getPlaylistPath);
        action.track.id = trackId;
        yield put(startCalcBpm(action.track, currentPlaylistPath));

    }


}

