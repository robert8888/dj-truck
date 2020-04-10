import { pushDirContent, ACTIONS } from "../../actions";
import {takeEvery, select , put} from "redux-saga/effects"
import { getApi } from "./../../apis/apiProvider";
import query from "./../../qlQueries/requestRootDir";

export default function *rootDirRequestSaga(){
    yield takeEvery(ACTIONS.PL_ROOT_REQUEST, callApi)
}

const getToken = state => state.user.token

function *callApi(){
    const {callQuery} = getApi("UserAssets");
    const token = yield select(getToken);

    let result = yield callQuery(query, token);

    const isRoot = true;
    yield put(pushDirContent(result.data.root, isRoot));
}

