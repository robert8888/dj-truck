import { ACTIONS, deleteComment } from "../../../actions";
import { takeEvery, select, put, } from "redux-saga/effects";
import { getApi } from "./../../../apis/apiProvider";

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
        const result = yield callQuery(query, token, {id : action.commentId});
        console.log(result)
        const success = result?.data;
        
        if (!result.errors && success) {
            yield put(deleteComment(action.commentId))
        } else {
            throw new Error("Can't delete comment from database")
        }
    } catch (e) {
        console.log(e.message)
    }
}
