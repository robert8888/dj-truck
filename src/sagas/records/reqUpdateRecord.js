
import { put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, pushLog, updateRec, updateRecFail } from "../../actions";
import { getApi } from "./../../apis/apiProvider";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";

export default function* requestRecordUpdate() {

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
            const variables = data;
            variables.id = id;

            const query = queries.updateRecordMetaQl;
            const response = yield callQuery(query, token, variables);

            const success = response?.data;

            if(response.errors){
                throw new Error("Server response contains errors" +  errorParser(response.errors));
            }
            if(!success){
                throw new Error("Can't update record in database")
            }
   
            yield put(updateRec(id, data))


            yield put(pushLog(new Log(`records variables: ${JSON.stringify(variables)}`)))
        } catch (error) {
            yield put(updateRecFail(action.recordChanges.title, error.message))
            yield pushLog(Log.Error(
                ['saga', 'records', 'reques update record'],
                "Can't update records in database",
                error
            ))
        }

    }

}
