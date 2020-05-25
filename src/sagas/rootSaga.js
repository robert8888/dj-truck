
import { all } from "redux-saga/effects";
import calcBpmAsyncSaga from "./calcBpmSaga";
import stopAllSaga from "./onStopAllSaga";
import requestAddTrack from "./playlists/reqAddTrackSaga";
import requestCopyTrackSaga from "./playlists/reqCopySaga";
import requestCreateDirSaga from "./playlists/reqCreateDirSaga";
import requestCreatePlaylistSaga from "./playlists/reqCreatePlaylistSaga";
import requestDeleteSelectedSaga from "./playlists/reqDeleteSelectedSaga";
import requestDeleteTrackSaga from "./playlists/reqDeleteTrackSaga";
import requestMoveToSaga from "./playlists/reqMoveToSaga";
import reqReadDirSaga from "./playlists/reqReadDirSaga";
import requestReadPlaylistSaga from "./playlists/reqReadPlaylistSaga";
import requestRenameSelectedSaga from "./playlists/reqRenameSelectedSaga";
import requestRootDirSaga from "./playlists/reqRootDirSaga";
import requestUpdateBpmSaga from "./playlists/reqUpdateBpmSaga";
import requestUpdateTrackPositionSaga from "./playlists/reqUpdateTrackPositionSaga";
import toogleDirSaga from "./playlists/toogleDirSaga";
import requestUserProfileSaga from "./profile/reqProfileSaqa";
import requestCreatedRecordSaga from "./recorder/reqCreateRecord";
import requestUpdateRecordSaga from "./recorder/reqUpdateRecord";
import tracklistRoot from './recorder/tracklist/tracklistRootSaga';
import requestCreateCommentSaga from "./records/comments/reqCreateComment";
import reuqestDeleteCommentSaga from "./records/comments/reqDeleteComment";
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
import ytSearchAsyncSaga from "./ytSearchSaga";


function* rootSaga(){
    yield all([
        ytSearchAsyncSaga(),
        calcBpmAsyncSaga(),


        stopAllSaga(),

        //playlist - dirs - traks
        requestRootDirSaga(),
        reqReadDirSaga(),
        requestCreateDirSaga(),
        requestCreatePlaylistSaga(),
        requestRenameSelectedSaga(),
        requestDeleteSelectedSaga(),
        requestMoveToSaga(),
        requestReadPlaylistSaga(),
        requestAddTrack(),
        requestUpdateBpmSaga(),
        requestCopyTrackSaga(),
        requestUpdateTrackPositionSaga(),
        requestDeleteTrackSaga(),
        toogleDirSaga(),

        //-- recorder
        requestCreatedRecordSaga(),
        requestUpdateRecordSaga(),
        tracklistRoot(),
        //--- records
        requestRecordsSaga(),
        requestRecordSaga(),
        requestRecordUpdateSaga(),
        requestRecordDelete(),
        requestCreateCommentSaga(),
        requestUpdateCommentSaga(),
        reuqestDeleteCommentSaga(),
        requestFavoriteSaga(),

        //----profiles
        requestUserProfileSaga(),

        currentUserSaga(),
        requestUpdateUserPictureSaga(),
        requestUpdateUserNicknameSaga(),
        requestUpdateUserDescriptionSaga(),

    ])
}

export default rootSaga;