import { put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, pushLog, setRecData } from "../../actions";
import { getApi } from "./../../apis/apiProvider";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";

export default function* requestUserRecord() {

    yield takeEvery(ACTIONS.RECS_REQ_DATA, handel)
}

const getToken = state => state.user.token

function* handel(action) {
    const token = yield select(getToken);

    try {
        const { callQuery, queries } = getApi("UserAssets");

        const query = queries.recordQl(action.recId);
        const response = yield callQuery(query, token);
        const recordData = response?.data?.record;
        
        if (response.errors) {
            throw new Error("Server response contains errors " + errorParser(response.errors));
        }
        if (!recordData){
            throw new Error("Can't load record data from database, server response don't contain recorcd data")
        }

        yield put(setRecData(recordData))

        yield put(pushLog(new Log(`Record successfully downloaded from database record id : ${action.recId}`)))
    } catch (error) {
        yield put(pushLog(Log.Error(
            ['saga', 'record', 'request record'],
            "Can't load record from database",
            error
        )))
    }
}
