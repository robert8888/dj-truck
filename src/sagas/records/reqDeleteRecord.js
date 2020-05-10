import { ACTIONS, setRecDeleteStatus } from "../../actions";
import { takeEvery, select, put, } from "redux-saga/effects";
import { getApi } from "./../../apis/apiProvider";

export default function* requestDeleteRecord() {
    console.log("handle request")
    yield takeEvery(ACTIONS.RECS_REQ_DELETE, handel)
}

const getToken = state => state.user.token

function* handel(action) {
    const token = yield select(getToken);

    try {
        const { callQuery, queries } = getApi("UserAssets");
        const { deleteRecord } = getApi('RecordsStore')
        
        const query = queries.deleteRecordQl(action.recordId);
        const result = yield callQuery(query, token);
        let success = result?.data?.deleteRecord;
        if(success){
            const status = yield deleteRecord(action.recordId);
            success = (status === 'success')
        }
        
        if (!result.errors && success) {
            yield put(setRecDeleteStatus("SUCCESS"))
        } else {
            throw new Error("Can't load reacords from database")
        }
    } catch (e) {
        yield put(setRecDeleteStatus("FAIL"))
    }

    

}
