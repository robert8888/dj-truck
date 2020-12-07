import { get } from "lodash/object";
import { put, putResolve, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, loadDirRequest, pushLog, toggleDir } from "actions";
import { Log } from "./../../utils/logger/logger";

export default function* openAndLoadDirRequest() {
    yield takeEvery(ACTIONS.PL_TOGGLE_DIR_REQUEST, handel)
}

const getToken = state => state.user.token

const getCurrentSelection = state => state.playList.currentSelection;

const getCurrent = (state, path) => get(state.playList, path);

function* handel(action) {
    const token = yield select(getToken);
    const currentSelection = yield select(getCurrentSelection);
    const current = yield select(getCurrent, currentSelection);

    if((!current._open && !current._loaded) && token){
        try{
            const open = true;
            yield putResolve(loadDirRequest(action.path, open))
        } catch (error){
            yield put(pushLog(Log.Error(
                ['saga', 'playlist', 'request read dir content in tootgle dir'],
                "Can't read dir conntent" + error.message,
                "Sorry. During process of reading dir content occurred a problem",
                error
            )))
        }
    } else {
        return yield put(toggleDir(action.path))
    }
}

