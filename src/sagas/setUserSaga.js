import { ACTIONS } from "../actions";
import { setUserProfileWithToken } from "./../actions";
import { put , call, select, takeEvery} from 'redux-saga/effects';
import {getToken} from "./../utils/auth/token";

const getLogged = state => state.user.logged;

export default function* watcher(){
    yield takeEvery(ACTIONS.SET_USER_PROFILE, setUserProfile);
}

function *setUserProfile(action){
    const logged = yield select(getLogged);
    if(logged){
        return
    }
  //  console.log("Set user profil")
   const token = yield call(getToken);

   yield put(setUserProfileWithToken(action.user, token))
}

