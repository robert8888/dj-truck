import { ACTIONS } from "../../actions";
import { takeEvery, select,  fork } from "redux-saga/effects"
import { getApi } from "./../../apis/apiProvider";

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

    const token = yield select(getToken);
    if(token){
        try{
            const { callQuery , queries } = getApi("UserAssets");
            const result = yield callQuery(queries.updateTrackQl, token,  {
                id: action.id,
                bpm: action.bpm,
                offset: action.offset
            })
            if(result.errors){
                throw new Error(result.errors);
            }
        } catch (err){
            console.log("Can't update bpm in database")
            console.log(err.message);
        }
    }
}

