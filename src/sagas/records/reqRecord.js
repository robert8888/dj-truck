import { ACTIONS, setRecData } from "../../actions";
import { takeEvery, select, put, } from "redux-saga/effects";
import { getApi } from "./../../apis/apiProvider";

export default function* requestUserRecord() {
    console.log("handle request")
    yield takeEvery(ACTIONS.RECS_REQ_DATA, handel)
}

const getToken = state => state.user.token

function* handel(action) {
    const token = yield select(getToken);

    try {
        const { callQuery, queries } = getApi("UserAssets");

        const query = queries.recordQl(action.recId);
        const result = yield callQuery(query, token);
        console.log(result)
        const recordData = result?.data?.record;
        
        if (!result.errors && recordData) {
            yield put(setRecData(recordData))
        } else {
            throw new Error("Can't load record data from database")
        }
    } catch (e) {
        console.log(e.message)
    }
}
