import {all} from "redux-saga/effects";
// midi profiles
import reqCreateMidiProfileSaga from "./midi/reqCreateProfile";
import reqReadMidiProfileSaga from "./midi/reqReadProfile";
import reqUpdateMidiProfileSaga from "./midi/reqUpdateProfile";
import reqDeleteMidiProfileSaga from "./midi/reqDeleteProfile";

export default function * controlRoot(){
    yield all([
        reqCreateMidiProfileSaga(),
        reqReadMidiProfileSaga(),
        reqUpdateMidiProfileSaga(),
        reqDeleteMidiProfileSaga(),
    ])
}