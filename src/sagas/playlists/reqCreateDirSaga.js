import { get } from "lodash/object";
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { call, put, select, takeEvery } from "redux-saga/effects";
import UUID from "uuidjs";
import { ACTIONS, createDir, pushLog } from "actions";
import { getApi } from "./../../apis/apiProvider";
import { findClosesDir, generateTemplateName as generateName } from "./../../reducers/console/playlist/utils";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";
import { handle as readDirSagaHandle } from "./reqReadDirSaga";

export default function* createDirRequestSaga() {
    yield takeEvery(ACTIONS.PL_CREATE_DIR_REQUEST, callApi)
}

const getToken = state => state.user.token;

const getCurrentSelection = state => state.playList.currentSelection;

const getParentPath = (state, currentSelection) =>
    findClosesDir(state, currentSelection)

const generateDirName = (state, parrentPath, base) =>
    generateName(state.playList, parrentPath, base);

const getParrentId = (state, path) => get(state.playList, path);

function* callApi(action) {
    const path = ['saga', 'playlist', 'request created dir'];

    const token = yield select(getToken);
    let renameMode = false;
    if (!token) {
        if (!action.name) {
            renameMode = true;
        }
        return yield put(createDir(action.name), UUID.genV1().toString(), renameMode);
    }
    try {
        yield put(showLoading());
        const { callQuery, queries } = getApi("UserAssets");
        const currentSelection = yield select(getCurrentSelection);
        const parrentPath = yield select(getParentPath, currentSelection);

        let dirName;
        if (!action.name) {
            dirName = yield select(generateDirName, parrentPath, "New folder");
            renameMode = true;
        } else {
            dirName = yield select(generateDirName, parrentPath, action.name);
        }

        const parrent = yield select(getParrentId, parrentPath);
        if (!parrent._loaded) {
            yield call(readDirSagaHandle, { path: parrentPath })
        }

        let response = yield callQuery(queries.createDirQl(parrent._id, dirName), token);

        if(response.errors){
            throw new Error('Server response contains errors '+ errorParser(response.errors))
        }

        if (!response.data?.createDir) {
            throw new Error("response don't contain data object")
        }

        const id = response.data.createDir.id;

        yield put(createDir(dirName, id, renameMode));
        
        yield put(pushLog(new Log(`Creating dir in database successful id: ${id}`, path)))
    } catch (error) {
        yield put(pushLog(Log.Error(
            path,
            "Can't create dir in database" + error.message,
            "Sorry. During process creating dir occurred a problem",
            error
        )))
    } finally {
        yield put(hideLoading())
    }
}

