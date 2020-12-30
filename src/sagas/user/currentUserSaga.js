import { call, put, select, takeEvery } from 'redux-saga/effects';
import { ACTIONS, pushLog, setUserProfileWithToken } from "actions";
import { getApi } from "apis/apiProvider";
import { getToken } from "auth0/getToken";
import { Log } from "utils/logger/logger";
import errorParser from "utils/serverErrorParser/errorParser";

const getLogged = state => state.user.logged;

export default function* watcher() {
    //action dispatched in auth0/react-auth0-spa.js
    yield takeEvery(ACTIONS.SET_USER_PROFILE, handle);
}

function* handle(action) {
    console.log("call get user data")
    const path = ['saga', 'current user saga'];
    const logged = yield select(getLogged);
    if (logged) {
        return
    }
    try{
        const { callQuery, queries } = getApi("UserAssets");
        const query = queries.myIdQl;
        const token = yield call(getToken);
        const response = yield callQuery(query, token);

        const user = response?.data?.me;
    
        if(response.errors){
            throw new Error("unable to reasd cucrent user data:" + errorParser(response.errors));
        }

        if(response.user){
            throw new Error("don't revice user data from server")
        }

        action.user = {
            ...action.user,
            dbId: user.id,
            ...user,
        }

        yield put(setUserProfileWithToken(action.user, token))
        
        yield put(pushLog(new Log("Recive current user data", path)))
    } catch(error){
        yield put(pushLog(Log.Error(
            path,
            error.message,
            "Sorry. During process of reading user data occurred a problem",
            error
        )))
    }

}

