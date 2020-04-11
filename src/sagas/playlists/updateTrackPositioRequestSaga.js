import { ACTIONS } from "../../actions";
import { takeEvery, select,  fork } from "redux-saga/effects"
import { getApi } from "./../../apis/apiProvider";

export default function* renameSelectedRequestSaga() {
    yield takeEvery(ACTIONS.PL_UPDATE_TRACK_POSITION_REQUST, handel)
}

function* handel(action){
    yield fork(sendDataToApi, action)
}

const getToken = state => state.user.token;

function* sendDataToApi(action) {
    const token = yield select(getToken);
    if(token){
        try{
            console.log(action.tracksPositions)
            const { callQuery , queries } = getApi("UserAssets");
            const result = yield callQuery(queries.updateTracksPositionsQl, token , {
                tracksPositions: action.tracksPositions,
            })
            console.log(result);
            if(result.errors){
                throw new Error(JSON.stringify(result.errors));
            }
        } catch (err){
            console.log("Can't update positon in database")
            console.log(err.message);
        }
    }
}

