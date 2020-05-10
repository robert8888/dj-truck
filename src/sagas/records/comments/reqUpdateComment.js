import { ACTIONS, updateComment } from "../../../actions";
import { takeEvery, select, put, } from "redux-saga/effects";
import { getApi } from "./../../../apis/apiProvider";

export default function* requestCreateComment() {
    yield takeEvery(ACTIONS.RECS_REQ_UPDATE_COMMENT, handel)
}

const getToken = state => state.user.token

function* handel(action) {
    const token = yield select(getToken);
    if(!token) return;

    try {
        console.log("coment data is " , action.commentData)
        const { callQuery, queries } = getApi("UserAssets");

        const query = queries.updateCommentQl;
        const result = yield callQuery(query, token, action.commentData);
        console.log(result)
        const success = result?.data;
        
        if (!result.errors && success) {
            yield put(updateComment(action.commentData))
        } else {
            throw new Error("Can't update comenta data in database")
        }
    } catch (e) {
        console.log(e.message)
    }
}
