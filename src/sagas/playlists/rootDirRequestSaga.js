import { pushDirContent, ACTIONS } from "../../actions";
import { takeEvery, select, put } from "redux-saga/effects"
import { getApi } from "./../../apis/apiProvider";


export default function* rootDirRequestSaga() {
    yield takeEvery(ACTIONS.PL_ROOT_REQUEST, callApi)
}

const getToken = state => state.user.token;

function* callApi() {
    const token = yield select(getToken);
    if (!token) {
        return;
    }
    try {
        const { callQuery, queries } = getApi("UserAssets");
        let result = yield callQuery(queries.loadRootContentQl, token);
        const isRoot = true;
        yield put(pushDirContent(result.data.root, isRoot));
    } catch (err) {
        console.log("connection to api problem");
        console.log(err);
    }

}

