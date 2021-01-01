import {all} from "redux-saga/effects";
import autoMaster from "./autoSetMasterSaga";
import autoLayout from "./autoDisableHeader";

export default function * controlRoot(){
    yield all([
        autoMaster(),
        autoLayout()
    ])
}