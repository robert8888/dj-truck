import { all } from "redux-saga/effects";
import consoleSagas from "./console";
import controlSaga from "./control";
import loggerSagas from "./logger";
import playlistSagas from "./playlists";
import profileSagas from "./profile";
import recorderSagas from "./recorder"
import recordsSagas from "./records";
import searchSagas from "./search";
import userSagas from "./user";
import effectorSagas from "./effector";

function* rootSaga(){
    yield all([
        consoleSagas(),
        controlSaga(),
        loggerSagas(),
        playlistSagas(),
        profileSagas(),
        recorderSagas(),
        recordsSagas(),
        searchSagas(),
        userSagas(),
        effectorSagas(),
    ])
}

export default rootSaga;