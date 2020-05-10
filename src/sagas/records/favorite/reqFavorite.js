import { ACTIONS, addRecordToFavorite, removeRecordFromFavorite } from "../../../actions";
import { takeEvery, select, put, } from "redux-saga/effects";
import { getApi } from "./../../../apis/apiProvider";

export default function* requestAddToFavorite() {
    console.log("handle request")
    const {queries } = getApi("UserAssets");
    const handelAdd = handel.bind(null, {
        query: queries.addToFavoriteQl,
        resultRoot: 'addToFavorite',
        successAction: addRecordToFavorite,
        failMessage: "Can't add to favorite in database" 
    })
    
    const handelRemove = handel.bind(null, {
        query: queries.removeFromFavoriteQl,
        resultRoot: 'removeFavorite',
        successAction: removeRecordFromFavorite,
        failMessage: "Can't remove record from favorite in database"
    })

    yield takeEvery(ACTIONS.RECS_REQ_ADD_FAVORITE, handelAdd)
    yield takeEvery(ACTIONS.RECS_REQ_RM_FAVORITE, handelRemove);


}

const getToken = state => state.user.token

function* handel({
    query, resultRoot, successAction, failMessage
}, action) {
    const token = yield select(getToken);

    try {
        const { callQuery } = getApi("UserAssets");
        const {recordId} = action;
        const response = yield callQuery(query, token, {recordId});
        let result = response?.data;
        if (!response.errors && result && result[resultRoot] ) {
            yield put(successAction(recordId));
        } else {
            throw new Error(failMessage)
        }
    } catch (e) {
        console.log("TO DO display error from saga !!! " + e.message)
    }

}
