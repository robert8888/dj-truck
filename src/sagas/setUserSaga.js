import { ACTIONS } from "../actions";
import { setUserProfileWithToken } from "./../actions";
import { put, call, select, takeEvery } from 'redux-saga/effects';
import { getToken } from "./../auth0/getToken";
import { getApi } from "./../apis/apiProvider";

const getLogged = state => state.user.logged;

export default function* watcher() {
    //action dispatched in auth0/react-auth0-spa.js
    yield takeEvery(ACTIONS.SET_USER_PROFILE, setUserProfile);
}

function* setUserProfile(action) {
    const logged = yield select(getLogged);
    if (logged) {
        return
    }
    const { callQuery, queries } = getApi("UserAssets");
    const query = queries.myIdQl;
    const token = yield call(getToken);
    const result = yield callQuery(query, token);
    
    const user = result?.data?.me;

    if(!result.errors && user){
        action.user = {
            ...action.user,
            dbId : user.id,
            ...user,
        }
    }
    yield put(setUserProfileWithToken(action.user, token))
}

