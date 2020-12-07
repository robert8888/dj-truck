import { put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, pushDirContent, pushLog } from "actions";
import { getApi } from "./../../apis/apiProvider";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";

export default function* rootDirRequestSaga() {
    yield takeEvery(ACTIONS.PL_ROOT_REQUEST, callApi)
}

const getToken = state => state.user.token;

function* callApi() {
    const path = ['saga', 'playlist', 'request read root dir']
    const token = yield select(getToken);
    if (!token) {
        return;
    }
    try {
        const { callQuery, queries } = getApi("UserAssets");
        let response = yield callQuery(queries.loadRootContentQl, token);

        if(response.errors){
            throw new Error('Server response contains errors '+ errorParser(response.errors))
        }
        
        const isRoot = true;
        yield put(pushDirContent(response.data.root, isRoot));

        yield put(pushLog(new Log("Root dir readed from database", path)))
    } catch (error) {
        yield put(pushLog(Log.Error(
            path,
            "Can't read root dir" + error.message,
            "Sorry. During process reding root directory occurred a problem",
            error
        )))
    }

}

