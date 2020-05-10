
import { all} from "redux-saga/effects"
import ytSearchAsyncSaga from "./ytSearchSaga";
import calcBpmAsyncSaga from "./calcBpmSaga";
import setUserSaga from "./setUserSaga";

import stopAllSaga from "./onStopAllSaga";

import getRootDirSaga from "./playlists/rootDirRequestSaga";
import loadDirRequestSaga from "./playlists/loadDirRequestSaga";
import createDirSaga from "./playlists/createDirRequestSaga";
import createPlaylistSaga from "./playlists/createPlaylistRequestSaga";
import renameSelectedSaga from "./playlists/renameSelectedSaga";
import deleteSelectedSaga from "./playlists/deleteSelectedSaga";
import moveElementToSaga from "./playlists/moveElementToRequestSaga";
import toogleDir from "./playlists/toogleDir";
import loadPlalistSaga from "./playlists/loadPlaylistRequestSaga";

import pushTrackToList from "./playlists/pushTrackToListRequestSaga";
import setBpmRequestSaga from "./playlists/setBpmRequestSaga";
import copyTrackToPlaylistSaga from"./playlists/copyTrackToPlaylistRequestSaga";
import updateTracksPositionsSaga from "./playlists/updateTrackPositioRequestSaga";
import deleteTrackSaga from "./playlists/deleteTrackRequestSaga";

import requestCreatedRecordSaga from "./recorder/reqCreateRecord";
//"final" after finish of recording
import requestUpdateRecordSaga from "./recorder/reqUpdateRecord"; 
import tracklistRoot  from './recorder/tracklist/tracklistRootSaga';

import requestRecordsSaga from "./records/reqRecords";
import requestRecordSaga from "./records/reqRecord";
import requestRecordUpdateSaga from "./records/reqUpdateRecord";
import requestRecordDelete from "./records/reqDeleteRecord";

import requestCreateCommentSaga from "./records/comments/reqCreateComment";
import requestUpdateCommentSaga from "./records/comments/reqUpdateComment";
import reuqestDeleteCommentSaga from "./records/comments/reqDeleteComment";

import requestFavoriteSaga from "./records/favorite/reqFavorite";

function* rootSaga(){
    yield all([
        ytSearchAsyncSaga(),
        calcBpmAsyncSaga(),
        setUserSaga(),

        stopAllSaga(),

        //playlist - dirs - traks
        getRootDirSaga(),
        loadDirRequestSaga(),
        createDirSaga(),
        createPlaylistSaga(),
        renameSelectedSaga(),
        deleteSelectedSaga(),
        moveElementToSaga(),
        toogleDir(),
        loadPlalistSaga(),
        pushTrackToList(),
        setBpmRequestSaga(),
        copyTrackToPlaylistSaga(),
        updateTracksPositionsSaga(),
        deleteTrackSaga(),

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
    ])
}

export default rootSaga;