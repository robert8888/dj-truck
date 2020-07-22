import {all} from "redux-saga/effects";
// kbd and mini control profiles
import reqCreateControlProfileSaga from "./control/reqCreateProfile";
import reqUpdateControlProfileSaga from "./control/reqUpdateProfile";
import reqDeleteControlProfileSaga from "./control/reqDeleteProfile";
import reqReadProfileList from "./control/reqProfileList";
import reqLoadProfile from "./control/reqLoadProfile";

export default function * controlRoot(){
    console.log("control root saga")
    yield all([
        reqCreateControlProfileSaga(),
        reqUpdateControlProfileSaga(),
        reqDeleteControlProfileSaga(),
        reqReadProfileList(),
        reqLoadProfile(),
    ])
}