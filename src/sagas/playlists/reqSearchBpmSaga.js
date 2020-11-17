import {put, takeEvery} from "redux-saga/effects";
import {ACTIONS, pushLog, setBpmAndOffset} from "../../actions";
import {getApi} from "../../apis/apiProvider";
import {Log} from "../../utils/logger/logger";


export default function* watcher() {
    yield takeEvery(ACTIONS.PL_INIT_SEARCH_BPM, searchBpmAsync);
}


function *searchBpmAsync(action){
    const path = ['saga', 'calcBpm', 'calculating bpm'];
    try{
        const {id, playlist, title, duration} = action.track;
        const api = getApi("SpotifyAnalyser");
        const data = yield api.getBpmAndOffset(title, duration);
        const {bpm, offset} = data;
        if(!bpm || !offset) return;
        yield put(setBpmAndOffset(id, playlist, bpm, offset))
    } catch (error){
        yield put(pushLog(Log.Error(
            path,
            "During connection with spotify analyser api occurred problem" + error.message,
            "Sorry. Something went wrong during searching bpm ",
            error
        )))
    }

}