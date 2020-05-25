import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { put, select, takeEvery } from 'redux-saga/effects';
import { ACTIONS, pushLog, setProfileDescription } from "../../actions";
import { getApi } from "./../../apis/apiProvider";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";

export default function* watchUpdateDescription() {
    yield takeEvery(ACTIONS.U_REQ_UPDATE_DESCRIPTION, handle);
}

const getToken = state => state.user.token;
const userId = state => state.user.id;

function* handle(action) {
    const path = ["Saga", "Request updated description"]
    const token = yield select(getToken);

    try {
        yield put(showLoading());
        const { callQuery, queries } = getApi("UserAssets");

        const query = queries.updateUserDescriptionQl;

        const response = yield callQuery(query, token , {description: action.description});
        const status = response?.data?.udpateMyDescription;
        //console.log(response, status)
        if(!status){
            throw new Error("Can't update description database")
        }

        if(response.errors){
            throw new Error("Can't update descritpion in database" + errorParser(response.errors))
        }

        if(status.error){
            throw new Error("Can't update description. " + status.message)
        }

        const id = yield select(userId)
        yield put(setProfileDescription(id, action.description))
        
        yield put(pushLog(new Log("User descirption updated to : " + action.description, path)))
    } catch (e) {
        yield put(pushLog(Log.Error(
            path,
            e.message,
            "Sorry. During process of updating description occurred a problem"
        )))
    } finally {
        yield put(hideLoading())
    }
}
