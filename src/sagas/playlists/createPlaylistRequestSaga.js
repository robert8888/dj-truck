import { createPlaylist, ACTIONS } from "../../actions";
import { takeEvery, select, put, call } from "redux-saga/effects"
import { getApi } from "./../../apis/apiProvider";
import query from "./../../qlQueries/createPlaylist";
import { generateTemplateName as generateName, findClosesDir } from "./../../reducers/console/playlist/utils";
import { get } from "lodash/object";
import {handel as loadDirSagaHanedl} from "./loadDirRequestSaga";

export default function* createDirRequestSaga() {
    yield takeEvery(ACTIONS.PL_CREATE_PLAYLIST_REQUEST, handle)
}

const getToken = state => state.user.token;

const getCurrentSelection = state => state.playList.currentSelection;

const getParentPath = (state, currentSelection) =>
    findClosesDir(state, currentSelection)

const generatePlaylistName = (state, parrentPath, base) => 
    generateName(state.playList, parrentPath, base);

const getParrentDir = (state, path) => get(state.playList, path);


export function* handle(action) {
    const { callQuery } = getApi("UserAssets");
    const token = yield select(getToken);
    const currentSelection = yield select(getCurrentSelection);
    const parrentPath = yield select(getParentPath, currentSelection);

    let renameMode = false;
    let playlistName;
    if(!action.name){
        playlistName = yield select(generatePlaylistName, parrentPath, "New playlist");
        renameMode = true;
    } else {
        playlistName = yield select(generatePlaylistName, parrentPath, action.name);
    }
    
    const parrentDir = yield select(getParrentDir, parrentPath);
    if(!parrentDir._loaded){
        yield call(loadDirSagaHanedl, {path: parrentPath})
    }

    let result = yield callQuery(query(parrentDir._id, playlistName), token);
    if(!result || !result.data?.createPlaylist){
        return ;
    }
    const id = result.data.createPlaylist.id;

    renameMode = (action.renameMode !== undefined) ? action.renameMode : renameMode; 

    yield put(createPlaylist(playlistName, id, renameMode, action.setCurrent));
    return id;
}

