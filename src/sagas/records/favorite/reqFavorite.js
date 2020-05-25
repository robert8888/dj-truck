import { put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, addRecordToFavorite, pushLog, removeRecordFromFavorite } from "../../../actions";
import { getApi } from "./../../../apis/apiProvider";
import { Log } from "./../../../utils/logger/logger";
import errorParser from "./../../../utils/serverErrorParser/errorParser";


export default function* requestAddToFavorite() {

    const { queries } = getApi("UserAssets");
    const handelAdd = handel.bind(null, {
        query: queries.addToFavoriteQl,
        resultRoot: 'addToFavorite',
        successAction: addRecordToFavorite,
        failMessage: "Can't add to favorite in database",
        successMessage: "Record added to favorite collection",
    })

    const handelRemove = handel.bind(null, {
        query: queries.removeFromFavoriteQl,
        resultRoot: 'removeFavorite',
        successAction: removeRecordFromFavorite,
        failMessage: "Can't remove record from favorite in database",
        successMessage: "Record removed from favorite collection",
    })

    yield takeEvery(ACTIONS.RECS_REQ_ADD_FAVORITE, handelAdd)
    yield takeEvery(ACTIONS.RECS_REQ_RM_FAVORITE, handelRemove);


}

const getToken = state => state.user.token

function* handel({
    query, resultRoot, successAction, failMessage, successMessage
}, action) {
    const token = yield select(getToken);

    try {
        const { callQuery } = getApi("UserAssets");
        const { recordId } = action;
        const response = yield callQuery(query, token, { recordId });
        let result = response?.data;

        if (response.errors) {
            throw new Error("Server response contains errors: " + errorParser(response.errors))
        }

        if(!result || !result[resultRoot]){
            throw new Error(failMessage)
        }

        yield put(successAction(recordId));

        yield put(pushLog(new Log(`Record favorite action : ${successMessage}`)))
    } catch (error) {
        yield pushLog(Log.Error(
            ['saga', 'record', 'request favorite'],
            error.message,
            "Can't remove record from favorite collection",
            error
        ))
    }

}
