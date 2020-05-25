import { put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, postComment, pushLog } from "../../../actions";
import { getApi } from "./../../../apis/apiProvider";
import { Log } from "./../../../utils/logger/logger";
import errorParser from "./../../../utils/serverErrorParser/errorParser";


export default function* requestCreateComment() {
    yield takeEvery(ACTIONS.RECS_REQ_POST_COMMENT, handel)
}

const getToken = state => state.user.token

function* handel(action) {
    const token = yield select(getToken);
    if(!token) return;

    try {
        const { callQuery, queries } = getApi("UserAssets");

        const query = queries.createCommentQl;
        const response = yield callQuery(query, token, action.commentData);

        const comment = response?.data?.createComment;
        
        if (response.errors) {
            throw new Error("Server response contains errors " + errorParser(response.errors));
        }

        if(!comment){
            throw new Error()
        }

        yield put(postComment(comment))

        yield put(pushLog(new Log(`Comment created in database id: ${comment.id}`)))
        
    } catch (error) {
        yield pushLog(Log.Error(
            ['saga', 'record', 'comments', 'request craeted comment'],
            "Can't create comment in database. "  + error.message,
            "Sorry. During creating comment in database occurred problem",
            error
        ))
    }
}
