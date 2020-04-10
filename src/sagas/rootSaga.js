
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
import toogleDir from "./playlists/toogleDir";
import loadPlalistSaga from "./playlists/loadPlaylistRequestSaga";
import pushTrackToList from "./playlists/pushTrackToListRequestSaga";

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
        toogleDir(),
        loadPlalistSaga(),
        pushTrackToList(),
    ])
}

export default rootSaga;