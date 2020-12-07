import {put, takeEvery} from "redux-saga/effects";
import {ACTIONS, pushLog, setBpmAndOffset, pushNotification} from "actions";
import {getApi} from "apis/apiProvider";
import {Log} from "utils/logger/logger";

export default function* watcher() {
    yield takeEvery(ACTIONS.PL_INIT_SEARCH_BPM, searchBpmAsync);
}


function *searchBpmAsync(action){
    const path = ['saga', 'calcBpm', 'calculating bpm'];
    try{
        const {id, playlist, title, duration} = action.track;
        const api = getApi("SpotifyAnalyser");
        const data = yield api.getBpmAndOffset(title, duration);

        if(!data) return;

        const {bpm, offset} = data;
        if(!bpm || !offset) {
            yield put(pushNotification({
                data: {
                    title: "Searching bpm value",
                    content: "Bpm value couldn't be found for track:  " + action.track.title,
                },
                timeout: 10_000,
            }))
        } else {
            yield put(setBpmAndOffset(id, playlist, bpm, offset))
        }

    } catch (error){
        yield put(pushLog(Log.Error(
            path,
            "During connection with spotify analyser api occurred problem" + error.message,
            "Sorry. Something went wrong during searching bpm ",
            error
        )))
    }

}