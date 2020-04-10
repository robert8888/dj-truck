import { renameSelected, ACTIONS } from "../../actions";
import { takeEvery, select, put } from "redux-saga/effects"
import { getApi } from "./../../apis/apiProvider";
import { renameDir, renamePlaylist } from "./../../qlQueries/rename";
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

const parentDirPath = (state , path) => findClosesDir(state.playList, path);

const parseName = (state, path, name) => generateName(state.playList, path, name);

function* callApi(action) {
    const { callQuery } = getApi("UserAssets");
    const token = yield select(getToken);
    const currentSelection = yield select(getCurrentSelection);
    const current = yield select(getCurrent, currentSelection);
    const parentPath = yield select(parentDirPath, currentSelection);

    const id = current._id;
    const isPlaylist = current instanceof Array;
 
    const name = yield select(parseName, parentPath, action.name)
    console.log("current in rename", current._id, current);

    if(!id){
        console.log("no id in reanem");
        return;
    }

    let query;
    if (isPlaylist) {
        query = renamePlaylist(id, name)
    } else { // dir
        query = renameDir(id, name)
    }

    let res = yield callQuery(query, token);
    console.log("rendame response", res)
    if (!res.erorrs) {
        console.log("dispatch rename")
        yield put(renameSelected(name));
    }
}

