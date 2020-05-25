import { put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, loadRecords, pushLog, recReqFails } from "../../actions";
import { getApi } from "./../../apis/apiProvider";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";

export default function* requestUserRecords() {

    yield takeEvery(ACTIONS.RECS_REQ_RECS, handel)
}

const getToken = state => state.user.token

function* handel(action) {
    const token = yield select(getToken);

    try {
        const { callQuery, queries } = getApi("UserAssets");
        const variables = { ...action.where };
        variables.pageSize = action.pageSize;
        variables.page = action.page;
        const query = queries.recordsQl;
        const response = yield callQuery(query, token, variables);
        const records = response?.data?.records?.records;
        const countAll = response?.data?.records?.countAll;

        if (response.errors) {
            throw new Error("Server response contains errors" + errorParser(response.errors));
        }
        if (!records) {
            throw new Error("Can't load reacords from database, response don't contains records object")
        }

        yield put(loadRecords(records, countAll))

        yield put(pushLog(new Log(`Records successfully downloaded from database parameters: \n ${JSON.stringify(variables)}`)))
    } catch (error) {
        yield put(recReqFails(error.message))
        yield pushLog(Log.Error(
            ['saga', 'records', 'request records'],
            "Can't load records from database " + error.message,
            error
        ))
    }
}
