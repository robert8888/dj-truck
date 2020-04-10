import { createDir, ACTIONS, loadDirRequest } from "../../actions";
import { takeEvery, select, put, call } from "redux-saga/effects"
import { getApi } from "./../../apis/apiProvider";
import query from "./../../qlQueries/createDir";
import { generateTemplateName as generateName, findClosesDir } from "./../../reducers/console/playlist/utils";
import { get } from "lodash/object";

import {handel as loadDirSagaHanedl} from "./loadDirRequestSaga";

export default function* createDirRequestSaga() {
    yield takeEvery(ACTIONS.PL_CREATE_DIR_REQEST, callApi)
}

const getToken = state => state.user.token;

const getCurrentSelection = state => state.playList.currentSelection;

const getParentPath = (state, currentSelection) =>
    findClosesDir(state, currentSelection)

const generateDirName = (state, parrentPath, base) => 
    generateName(state.playList, parrentPath, base);

const getParrentId = (state, path) => get(state.playList, path);



function* callApi(action) {
    const { callQuery } = getApi("UserAssets");
    const token = yield select(getToken);
    const currentSelection = yield select(getCurrentSelection);
    const parrentPath = yield select(getParentPath, currentSelection);

    let renameMode = false;
    let dirName;
    if(!action.name){
        dirName = yield select(generateDirName, parrentPath, "New folder");
        renameMode = true;
    } else {
        dirName = yield select(generateDirName, parrentPath, action.name);
    }
    
    const parrent = yield select(getParrentId, parrentPath);
    if(!parrent._loaded){
        yield call(loadDirSagaHanedl, {path: parrentPath})
    }

    let result = yield callQuery(query(parrent._id, dirName), token);
    if(!result || !result.data?.createDir){
        return;
    }
    const id = result.data.createDir.id;

    yield put(createDir(dirName, id, renameMode));
}

