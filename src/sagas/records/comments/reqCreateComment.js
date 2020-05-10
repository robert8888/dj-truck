import { ACTIONS, postComment } from "../../../actions";
import { takeEvery, select, put, } from "redux-saga/effects";
import { getApi } from "./../../../apis/apiProvider";

export default function* requestCreateComment() {
    yield takeEvery(ACTIONS.RECS_REQ_POST_COMMENT, handel)
}

const getToken = state => state.user.token

function* handel(action) {
    const token = yield select(getToken);
    if(!token) return;

    try {
        const { callQuery, queries } = getApi("UserAssets");

        console.log(action.commentData)
        const query = queries.createCommentQl;
        const result = yield callQuery(query, token, action.commentData);
        console.log(result)
        const comment = result?.data?.createComment;
        
        if (!result.errors && comment) {
            yield put(postComment(comment))
        } else {
            throw new Error("Can't craete comment in database")
        }
    } catch (e) {
        console.log(e.message)
    }
}
