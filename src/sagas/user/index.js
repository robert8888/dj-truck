import {all} from "redux-saga/effects";
import currentUserSaga from "./currentUserSaga";
import requestUpdateUserPictureSaga from "./reqUpdatePicture";
import requestUpdateUserNicknameSaga from "./reqUpdateNickname";
import requestUpdateUserDescriptionSaga from "./reqUpdateDescription";

export default function * userRoot(){
    yield all([
        currentUserSaga(),
        requestUpdateUserPictureSaga(),
        requestUpdateUserNicknameSaga(),
        requestUpdateUserDescriptionSaga(),
    ])
}