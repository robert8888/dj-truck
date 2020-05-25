import { put, takeEvery } from "redux-saga/effects";
import { ACTIONS, pushLog, setProfile } from "./../../actions";
import { getApi } from "./../../apis/apiProvider";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";

export default function* requestUserProfile() {
    yield takeEvery(ACTIONS.P_REQ_PROFILE, handle)
}

function* handle(action) {
    const path = ['saga', 'profile', 'request profile data']
    try {
        if(!action.nickname) {
            return;
        }
        const { callQuery, queries } = getApi("UserAssets");
        const query = queries.getProfileQl;

        const response = yield callQuery(query, null, { nickname: action.nickname })

        if (response.errors) {
            throw new Error('Server response contains errors '+ errorParser(response.errors))
        }

        if(!response?.data?.profile){
            throw new Error();
        }

        yield put(setProfile(response.data.profile))

        yield put(pushLog(new Log(`Profile : ${action.nickname} data recived from database`, path)))
    } catch (error) {
        yield put(pushLog(Log.Error(
            path,
            error.message,
            'can \'t get profiele data from database' + error.message,
            error
        )))
    }
}


