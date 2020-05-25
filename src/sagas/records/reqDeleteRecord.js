import { put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, pushLog, setRecDeleteStatus } from "../../actions";
import { getApi } from "./../../apis/apiProvider";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";


export default function* requestDeleteRecord() {
    console.log("handle request")
    yield takeEvery(ACTIONS.RECS_REQ_DELETE, handel)
}

const getToken = state => state.user.token

function* handel(action) {
    const token = yield select(getToken);

    try {
        const { callQuery, queries } = getApi("UserAssets");
        const { deleteRecord: deleteRecordFromStore } = getApi('RecordsStore')

        const query = queries.deleteRecordQl(action.recordId);
        const response = yield callQuery(query, token);

        if (response.errors) {
            throw new Error("Server response contains errors " + errorParser(response.errors));
        }

        let success = response?.data?.deleteRecord;
        if (success) {
            const status = yield deleteRecordFromStore(action.recordId);
            success = (status === 'success')
        }


        if (!success) {
            throw new Error("Can't delete reacords from record store database")
        } 

        yield put(setRecDeleteStatus("SUCCESS"))

        yield put(pushLog(new Log(`Record successfully deleted in database, record id: ${action.recordId}`)))
    } catch (error) {
        yield put(setRecDeleteStatus("FAIL"))
        yield pushLog(Log.Error(
            ['saga', 'record', 'request download record'],
            "Can't delete record in database",
            "Sorry. During process of deleteing record from database occurred a problem",
            error
        ))
    }



}
