import { toggleDir, ACTIONS, pushDirContent , loadDirRequest} from "../../actions";
import { takeEvery, select, put, putResolve,  } from "redux-saga/effects"
import { getApi } from "./../../apis/apiProvider";
import requestDirContetQuery from "./../../qlQueries/requestDirContent";
import { get } from "lodash/object";

export default function* openAndLoadDirRequest() {
    yield takeEvery(ACTIONS.PL_TOGGLE_DIR_REQUEST, handel)
}

const getCurrentSelection = state => state.playList.currentSelection;

const getCurrent = (state, path) => get(state.playList, path);

function* handel(action) {

    const currentSelection = yield select(getCurrentSelection);
    const current = yield select(getCurrent, currentSelection);

    if(!current._open && !current._loaded){
        const open = true;
        yield putResolve(loadDirRequest(action.path, open))

    } else {
        return yield put(toggleDir(action.path))
    }
}

