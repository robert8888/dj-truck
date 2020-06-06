import { put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, deleteComment, pushLog } from "../../../actions";
import { getApi } from "./../../../apis/apiProvider";
import { Log } from "./../../../utils/logger/logger";
import errorParser from "./../../../utils/serverErrorParser/errorParser";

export default function* requestDeleteComment() {
    yield takeEvery(ACTIONS.RECS_REQ_DELETE_COMMENT, handel)
}

const getToken = state => state.user.token

function* handel(action) {
    const token = yield select(getToken);
    if(!token) return;

    try {
        const { callQuery, queries } = getApi("UserAssets");

        const query = queries.deleteCommentQl;
        const response = yield callQuery(query, token, {id : action.commentId});

        if (response.errors) {
            throw new Error("Server response contains errors " + errorParser(response.errors));
        }

        const success = response?.data;

        if (!success) {
            throw new Error()
        }

        yield put(deleteComment(action.commentId))
        
        yield put(pushLog(new Log(`Comment id: ${action.commentId} deleted from database`)))
    } catch (error) {
        yield put(pushLog(Log.Error(
            ['saga', 'record', 'comments', 'request delete comment'],
            "Can't delete comment from database"+ error.message,
            "Sorry. During process of deleting comment in database occurred problem",
            error
        )))
    }
}
