import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { put, select, takeEvery } from 'redux-saga/effects';
import { ACTIONS, pushLog, setProfilePicutre } from "../../actions";
import { getApi } from "./../../apis/apiProvider";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";

export default function* watcher() {
    yield takeEvery(ACTIONS.U_REQ_UPDATE_PICTURE, handle);
}

const getToken = state => state.user.token
const userId = state => state.user.dbId

function* handle(action) {
    const path = ["Saga", "Request updated picture"]
    const token = yield select(getToken);

    try {
        yield put(showLoading());
        const { callQueryUploadSingle, queries } = getApi("UserAssets");

        const query = queries.updateUserPictureQl;
        const variables = { file: action.file };
        const response = yield callQueryUploadSingle(query, token, variables);

        const status = response?.data?.updateMyPicture;

        if (response.errors) {
            throw new Error("Can't update picture in database: " + errorParser(response.errors))
        }

        if (!status) {
            throw new Error("Can't read status object from server response")
        }

        if (!status?.success) {
            throw new Error("Operation of updateing user picture fail. " + status.message)
        }

        const id = yield select(userId);
        yield put(setProfilePicutre(id, status.data));

        yield put(pushLog(new Log("User picture updated to : " + action.picture, path)));
    } catch (error) {
        yield put(pushLog(Log.Error(
            path,
            "Update user picture fail " + error.message,
            "Sorry. During process of updating picture occurred a problem",
            error
        )))
    } finally {
        yield put(hideLoading())
    }
}
