import { renameSelected, ACTIONS } from "../../actions";
import { takeEvery, select, put } from "redux-saga/effects";
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import { getApi } from "./../../apis/apiProvider";
import { get } from "lodash/object";
import {
    generateTemplateName as generateName,
    findClosesDir
} from "./../../reducers/console/playlist/utils"

export default function* renameSelectedRequestSaga() {
    yield takeEvery(ACTIONS.PL_RENAME_SELECTED_REQUEST, callApi)
}

const getToken = state => state.user.token;

const getCurrentSelection = state => state.playList.currentSelection;

const getCurrent = (state, path) => get(state.playList, path);

const parentDirPath = (state, path) => findClosesDir(state.playList, path);

const parseName = (state, path, name) => generateName(state.playList, path, name);

function* callApi(action) {

    const token = yield select(getToken);
    if (!token) {
        yield put(renameSelected(action.name));
        return;
    }
    try {
        yield put(showLoading());
        const { callQuery, queries } = getApi("UserAssets");
        const currentSelection = yield select(getCurrentSelection);
        const current = yield select(getCurrent, currentSelection);
        const parentPath = yield select(parentDirPath, currentSelection);

        const id = current._id;
        const isPlaylist = (current._type === "playlist");

        const name = yield select(parseName, parentPath, action.name)

        if (!id) {
            throw new Error("Element id missing")
        }

        let query;
        if (isPlaylist) {
            query = queries.renameQl.renamePlaylist(id, name)
        } else { // dir
            query = queries.renameQl.renameDir(id, name)
        }

        let res = yield callQuery(query, token);
        if (!res.erorrs) {
            yield put(renameSelected(name));
        } else {
            throw new Error(JSON.stringify(res.errors))
        }
    } catch (err) {
        console.log("Can't reaname element in database. Api call problem");
        console.log(err.message);
    } finally{
      yield put(hideLoading())
    }
}

