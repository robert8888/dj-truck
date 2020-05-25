import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { put, select, takeEvery } from 'redux-saga/effects';
import { ACTIONS, pushLog, setProfileNickname } from "../../actions";
import { getApi } from "./../../apis/apiProvider";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";

export default function* watcher() {
    yield takeEvery(ACTIONS.U_REQ_UPDATE_NICKNAME, handle);
}

const getToken = state => state.user.token
const userId = state => state.user.id;

function* handle(action) {
    const path = ["Saga", "Request updated nickname"]
    const token = yield select(getToken);

    try {
        yield put(showLoading());
        const { callQuery, queries } = getApi("UserAssets");

        const query = queries.updateNicknameQl;

        const response = yield callQuery(query, token, {nickname: action.nickname});

        const status = response?.data?.updateMyNick;
        //console.log(response, status);
        if(response.errors){
            throw new Error("Can't update nickname in database" + errorParser(response.errors))
        }

        if(!status){
            throw new Error('Can\'t read status object from server response');
        }

        if(status.error){
            throw new RangeError("Can't update nickname. " + status.message)
        }

        const id = yield select(userId)
        yield put(setProfileNickname(id, action.nickname));
        
        yield put(pushLog(new Log("User nickname updated to : " + action.nickname, path)));
    } catch (e) {
        if(e instanceof RangeError){
            yield put(pushLog(Log.Warning(
                e.message,
            )))
            return; 
        }
        
        yield put(pushLog(Log.Error(
            path,
            e.message,
            "Sorry. During process of updating nickname occurred a problem"
        )))
    } finally {
        yield put(hideLoading())
    }
}
