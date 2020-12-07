import { fork, put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, pushLog } from "actions";
import { getApi } from "./../../apis/apiProvider";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";

export default function* renameSelectedRequestSaga() {
    yield takeEvery(ACTIONS.PL_SET_BPM_AND_OFFSET, handel)
}

function* handel(action){
    if(typeof action.bpm === "number"){
        yield fork(sendDataToApi, action)
    }
}

const getToken = state => state.user.token;

function* sendDataToApi(action) {
    const path = ['saga', 'playlist', 'request updated bpm and offset']
    const token = yield select(getToken);
    if(token){
        try{
            const { callQuery , queries } = getApi("UserAssets");
            const variables = {
                id: action.id,
                bpm: action.bpm,
                offset: action.offset
            };

            const response = yield callQuery(queries.updateTrackQl, token, variables);
            if(response.errors){
                throw new Error('Server response contains errors '+ errorParser(response.errors))
            }
            
            yield put(pushLog(new Log("Track bpm and offset updated id:" + action.id, path)))
        } catch (error){
            yield put(pushLog(Log.Error(
                path,
                "Can't update bpm and offset" + error.message,
                "Sorry. During process of updating track bpm occurred a problem",
                error
            )))
        }
    }
}

