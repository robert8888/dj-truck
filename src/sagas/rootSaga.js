
import { all } from "redux-saga/effects";
import requestSearchResultsSaga from "./externalSearch/reqSearchResultSaga";
import printLog from "./logger/print";
import requestCalcBpmSaga from "./playlists/reqCalcBpmSaga";
import requestSearchBpmSaga from "./playlists/reqSearchBpmSaga";
import requestUpdateBpmOrOffsetSaga from "./playlists/reqUpdateBpmOrOffset";
import requestAddTrack from "./playlists/reqAddTrackSaga";
import requestCopyTrackSaga from "./playlists/reqCopySaga";
import requestCreateDirSaga from "./playlists/reqCreateDirSaga";
import requestCreatePlaylistSaga from "./playlists/reqCreatePlaylistSaga";
import requestDeleteSelectedSaga from "./playlists/reqDeleteSelectedSaga";
import requestDeleteTrackSaga from "./playlists/reqDeleteTrackSaga";
import requestMoveToSaga from "./playlists/reqMoveToSaga";
import requestCachePlaylist from "./playlists/reqCacheList";
import reqReadDirSaga from "./playlists/reqReadDirSaga";
import requestReadPlaylistSaga from "./playlists/reqReadPlaylistSaga";
import requestRenameSelectedSaga from "./playlists/reqRenameSelectedSaga";
import requestRootDirSaga from "./playlists/reqRootDirSaga";
import requestUpdateBpmSaga from "./playlists/reqUpdateBpmSaga";
import requestUpdateTrackPositionSaga from "./playlists/reqUpdateTrackPositionSaga";
import toggleDirSaga from "./playlists/toogleDirSaga";
import requestUserProfileSaga from "./profile/reqProfileSaqa";
import stopAllSaga from "./recorder/onStopAllSaga";
import requestCreatedRecordSaga from "./recorder/reqCreateRecord";
import requestUpdateRecordSaga from "./recorder/reqUpdateRecord";
import tracklistRoot from './recorder/tracklist/tracklistRootSaga';
import requestCreateCommentSaga from "./records/comments/reqCreateComment";
import requestDeleteCommentSaga from "./records/comments/reqDeleteComment";
import requestUpdateCommentSaga from "./records/comments/reqUpdateComment";
import requestFavoriteSaga from "./records/favorite/reqFavorite";
import requestRecordDelete from "./records/reqDeleteRecord";
import requestRecordSaga from "./records/reqRecord";
import requestRecordsSaga from "./records/reqRecords";
import requestRecordUpdateSaga from "./records/reqUpdateRecord";
import currentUserSaga from "./user/currentUserSaga";
import requestUpdateUserDescriptionSaga from "./user/reqUpdateDescription";
import requestUpdateUserNicknameSaga from "./user/reqUpdateNickname";
import requestUpdateUserPictureSaga from "./user/reqUpdatePicture";
import controlSaga from "./control";

function* rootSaga(){
    yield all([
        //--- loger
        printLog(),
        //--- external search
        requestSearchResultsSaga(),

        //--- playlist - dirs - traks
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
        // -- control - midi and kbd profiles
        controlSaga(),
        //--- recorder
        requestCreatedRecordSaga(),
        requestUpdateRecordSaga(),
        tracklistRoot(), // recorder intercept adding track to record
        stopAllSaga(),

        //--- records
        requestRecordsSaga(),
        requestRecordSaga(),
        requestRecordUpdateSaga(),
        requestRecordDelete(),
        requestCreateCommentSaga(),
        requestUpdateCommentSaga(),
        requestDeleteCommentSaga(),
        requestFavoriteSaga(),

        //--- profiles
        requestUserProfileSaga(),
        //--- user
        currentUserSaga(),
        requestUpdateUserPictureSaga(),
        requestUpdateUserNicknameSaga(),
        requestUpdateUserDescriptionSaga(),
    ])
}

export default rootSaga;