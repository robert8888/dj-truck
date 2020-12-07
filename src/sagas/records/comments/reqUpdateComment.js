import { put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, pushLog, updateComment } from "actions";
import { getApi } from "./../../../apis/apiProvider";
import { Log } from "./../../../utils/logger/logger";
import errorParser from "./../../../utils/serverErrorParser/errorParser";

export default function* requestCreateComment() {
    yield takeEvery(ACTIONS.RECS_REQ_UPDATE_COMMENT, handel)
}

const getToken = state => state.user.token

function* handel(action) {
    const token = yield select(getToken);
    if(!token) return;

    try {
        const { callQuery, queries } = getApi("UserAssets");

        const query = queries.updateCommentQl;
        const response = yield callQuery(query, token, action.commentData);

        
        if (response.errors) {
            throw new Error("Server response contains errors " + errorParser(response.errors));
        }

        const success = response?.data;
        
        if (!success) {
            throw new Error()
        } 

        yield put(updateComment(action.commentData));
        
        yield put(pushLog(new Log(`Comment id: ${action.commentId} data updated in database`)))
    } catch (error) {
        yield put(pushLog(Log.Error(
            ['saga', 'record', 'comments', 'request updated comment'],
            "Can't update comenta data in database" + error.message,
            "Sorry. During updating comment in database occurred problem",
            error
        )))
    }
}
