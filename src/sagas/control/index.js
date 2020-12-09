import {all} from "redux-saga/effects";
import reqCreateControlProfileSaga from "./control/reqCreateProfile";
import reqUpdateControlProfileSaga from "./control/reqUpdateProfile";
import reqDeleteControlProfileSaga from "./control/reqDeleteProfile";
import reqReadProfileList from "./control/reqProfileList";
import reqLoadProfile from "./control/reqLoadProfile";

export default function * controlRoot(){
    yield all([
        reqCreateControlProfileSaga(),
        reqUpdateControlProfileSaga(),
        reqDeleteControlProfileSaga(),
        reqReadProfileList(),
        reqLoadProfile(),
    ])
}