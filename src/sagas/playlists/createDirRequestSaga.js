import { createDir, ACTIONS, loadDirRequest } from "../../actions";
import { takeEvery, select, put, call } from "redux-saga/effects"
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import { getApi } from "./../../apis/apiProvider";
import { generateTemplateName as generateName, findClosesDir } from "./../../reducers/console/playlist/utils";
import { get } from "lodash/object";
import UUID from "uuidjs"
import { handel as loadDirSagaHanedl } from "./loadDirRequestSaga";

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
            yield call(loadDirSagaHanedl, { path: parrentPath })
        }

        let result = yield callQuery(queries.createDirQl(parrent._id, dirName), token);

        if (result.errors || !result.data?.createDir) {
            throw new Error("unable to create dir", JSON.stringify(result.errors))
        }
        const id = result.data.createDir.id;

        yield put(createDir(dirName, id, renameMode));
        
    } catch (err) {
        console.log("probllem with api call");
        console.log(err.message);
    } finally {
        yield put(hideLoading())
    }
}

