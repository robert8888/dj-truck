import {all} from "redux-saga/effects";
import requestCalcBpmSaga from "./reqCalcBpmSaga";
import requestSearchBpmSaga from "./reqSearchBpmSaga";
import requestUpdateBpmOrOffsetSaga from "./reqUpdateBpmOrOffset";
import requestAddTrack from "./reqAddTrackSaga";
import requestCopyTrackSaga from "./reqCopySaga";
import requestCreateDirSaga from "./reqCreateDirSaga";
import requestCreatePlaylistSaga from "./reqCreatePlaylistSaga";
import requestDeleteSelectedSaga from "./reqDeleteSelectedSaga";
import requestDeleteTrackSaga from "./reqDeleteTrackSaga";
import requestMoveToSaga from "./reqMoveToSaga";
import requestCachePlaylist from "./reqCacheList";
import reqReadDirSaga from "./reqReadDirSaga";
import requestReadPlaylistSaga from "./reqReadPlaylistSaga";
import requestRenameSelectedSaga from "./reqRenameSelectedSaga";
import requestRootDirSaga from "./reqRootDirSaga";
import requestUpdateBpmSaga from "./reqUpdateBpmSaga";
import requestUpdateTrackPositionSaga from "./reqUpdateTrackPositionSaga";
import toggleDirSaga from "./toogleDirSaga";

export default function * playlistRoot(){
    yield all([
        requestRootDirSaga(),
        reqReadDirSaga(),
        requestCreateDirSaga(),
        requestCreatePlaylistSaga(),
        requestRenameSelectedSaga(),
        requestDeleteSelectedSaga(),
        requestMoveToSaga(),
        requestCachePlaylist(),
        requestReadPlaylistSaga(),
        requestAddTrack(),
        requestUpdateBpmSaga(),
        requestUpdateBpmOrOffsetSaga(),
        requestCopyTrackSaga(),
        requestUpdateTrackPositionSaga(),
        requestDeleteTrackSaga(),
        toggleDirSaga(),
        requestSearchBpmSaga(),
        requestCalcBpmSaga(),
    ])
}