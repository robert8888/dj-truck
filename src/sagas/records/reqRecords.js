import { ACTIONS, loadRecords, recReqFails } from "../../actions";
import { takeEvery, select, put, } from "redux-saga/effects";
import { getApi } from "./../../apis/apiProvider";

export default function* requestUserRecords() {
    console.log("handle request")
    yield takeEvery(ACTIONS.RECS_REQ_RECS, handel)
}

const getToken = state => state.user.token

function* handel(action) {
    const token = yield select(getToken);

    try {
        const { callQuery, queries } = getApi("UserAssets");
        const vars = {...action.where};
        vars.pageSize = action.pageSize;
        vars.page = action.page;

        console.log("var", vars)
        const query = queries.recordsQl;
        const result = yield callQuery(query, token, vars);
        console.log(result)
        const records = result?.data?.records?.records;
        const countAll = result?.data?.records?.countAll;
        if (!result.errors && records) {
            yield put(loadRecords(records, countAll))
        } else {
            throw new Error("Can't load reacords from database")
        }
    } catch (e) {
        yield put(recReqFails(e.message))
    }
}
