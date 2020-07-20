import {all} from "redux-saga/effects";
// kbd and mini control profiles
import reqCreateControlProfileSaga from "./control/reqCreateProfile";
import reqReadControlProfileSaga from "./control/reqReadProfile";
import reqUpdateControlProfileSaga from "./control/reqUpdateProfile";
import reqDeleteControlProfileSaga from "./control/reqDeleteProfile";

export default function * controlRoot(){
    yield all([
        reqCreateControlProfileSaga(),
        reqReadControlProfileSaga(),
        reqUpdateControlProfileSaga(),
        reqDeleteControlProfileSaga(),
    ])
}