
import { ACTIONS, updateRec, updateRecFail } from "../../actions";
import { takeEvery, select, put, } from "redux-saga/effects";
import { getApi } from "./../../apis/apiProvider";

export default function* requestRecordUpdate() {
    console.log("handle request")
    yield takeEvery(ACTIONS.RECS_REQ_UPDATE, handel)
}

const getToken = state => state.user.token
//recordId,  recordChanges
function* handel(action) {
    const token = yield select(getToken);

    if (token) {
        try {
            const { callQuery, queries } = getApi("UserAssets");
            const {recordId: id, recordChanges:data} = action;
            const vars = data;
            vars.id = id;

            console.log("var", vars)
            const query = queries.updateRecordMetaQl;
            const result = yield callQuery(query, token, vars);
            console.log(result)
            const success = result?.data;
            if (!result.errors && success) {
                yield put(updateRec(id, data))
            } else {
                throw new Error("Can't load reacords from database")
            }
        } catch (e) {
            yield put(updateRecFail(action.recordChanges.title, e.message))
        }

    }

}
