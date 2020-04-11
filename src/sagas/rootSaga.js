
import { all} from "redux-saga/effects"
import ytSearchAsyncSaga from "./ytSearchSaga";
import calcBpmAsyncSaga from "./calcBpmSaga";
import setUserSaga from "./setUserSaga";

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

function* rootSaga(){
    yield all([
        ytSearchAsyncSaga(),
        calcBpmAsyncSaga(),
        setUserSaga(),

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
    ])
}

export default rootSaga;