import { fork, put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, pushLog } from "actions";
import { getApi } from "./../../apis/apiProvider";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";

export default function* renameSelectedRequestSaga() {
    yield takeEvery(ACTIONS.PL_UPDATE_TRACK_POSITION_REQUST, handel)
}

function* handel(action){
    yield fork(sendDataToApi, action)
}

const getToken = state => state.user.token;

function* sendDataToApi(action) {
    const path = ['saga', 'playlist', 'request updated tracks positios']
    const token = yield select(getToken);
    if(token){
        try{
            const { callQuery , queries } = getApi("UserAssets");
            const response = yield callQuery(queries.updateTracksPositionsQl, token , {
                tracksPositions: action.tracksPositions,
            })

            if(response.errors){
                throw new Error('Server response contains errors '+ errorParser(response.errors))
            }

            yield put(pushLog(new Log("Tracks position on playlist updated", path)))
        } catch (error){
            yield put(pushLog(Log.Error(
                path,
                "Can't update tracks position on playlist in database" + error.message,
                "Sorry. During process of updating track position on playlist occurred a problem",
                error
            )))
        }
    }
}

