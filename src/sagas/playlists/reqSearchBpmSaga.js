import {put, takeEvery} from "redux-saga/effects";
import {ACTIONS, setBpmAndOffset} from "../../actions";
import {getApi} from "../../apis/apiProvider";


export default function* watcher() {
    yield takeEvery(ACTIONS.PL_INIT_SEARCH_BPM, searchBpmAsync);
}


function *searchBpmAsync(action){
    const path = ['saga', 'calcBpm', 'calculating bpm'];
    const {id, playlist, title, duration} = action.track;
    console.log(title, duration)
    const api = getApi("SpotifyAnalyser");
    const data = yield api.getBpmAndOffset(title, duration);
    console.log(data)
    const {bpm, offset} = data;
    yield put(setBpmAndOffset(id, playlist, bpm, offset))
}