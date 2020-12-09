import {all} from "redux-saga/effects";
import requestRecordsSaga from "./reqRecords";
import requestRecordSaga from "./reqRecord";
import requestRecordUpdateSaga from "./reqUpdateRecord";
import requestRecordDelete from "./reqDeleteRecord";
import requestCreateCommentSaga from "./comments/reqCreateComment";
import requestUpdateCommentSaga from "./comments/reqUpdateComment";
import requestDeleteCommentSaga from "./comments/reqDeleteComment";
import requestFavoriteSaga from "./favorite/reqFavorite";

export default function * recordsRoot(){
    yield all([
        requestRecordsSaga(),
        requestRecordSaga(),
        requestRecordUpdateSaga(),
        requestRecordDelete(),
        requestCreateCommentSaga(),
        requestUpdateCommentSaga(),
        requestDeleteCommentSaga(),
        requestFavoriteSaga(),
    ])
}