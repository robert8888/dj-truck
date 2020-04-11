import { toggleDir, ACTIONS,  loadDirRequest} from "../../actions";
import { takeEvery, select, put, putResolve,  } from "redux-saga/effects";
import { get } from "lodash/object";

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
        } catch (err){
            console.log("Cant load dir content")
            console.log(err.message)
        }
    } else {
        return yield put(toggleDir(action.path))
    }
}

