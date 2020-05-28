import { call, put, takeEvery } from 'redux-saga/effects';
import { ACTIONS, pushLog, setBpmAndOffset } from "../actions";
import { getApi } from "./../apis/apiProvider";
import { calcAccurateBpmAndOffset } from './../utils/bpm/analyzer';
import { Log } from "./../utils/logger/logger";

export default function* watcher() {
    yield takeEvery(ACTIONS.PL_INIT_CALC_BPM, calcBpmAsync);
    yield takeEvery(ACTIONS.PL_PUSH_TRACK, calcBpmAsync);
}



function* calcBpmAsync(action) {
    const path = ['saga', 'calcBpm', 'calculatin bpm']
    try{
        const {sourceId: id, source, duration} = action.track;
        if(duration > 60 * 20) // 20 min;
        {
            const priv = "Can't calculating bpm track duration is to big: " + duration;
            const logArgs = [path, priv];
            if(action.type === ACTIONS.PL_INIT_CALC_BPM) {
                const pub = "Sorry. Bpm calculation is possible only for track which duration is up to 20 minutes";
                logArgs.push(pub)
            }
            yield put(pushLog(Log.Error(logArgs)))
            return;
        }
        const api = getApi(source);
        const url = api.getUrl(id);

        // console.log(action)
        yield put(setBpmAndOffset(action.track.id, action.playlist, "calculating", null))
        let { offset, bpm } = yield call(calcAccurateBpmAndOffset, url);
        yield put(setBpmAndOffset(action.track.id, action.playlist, bpm, offset))
        
        yield put(pushLog(new Log(`Track id: ${id} bpm and offset successful updated`, path)))
    } catch (error){
        yield put(pushLog(Log.Error(
            path,
            "Can't calculating bpm. " + error.message,
            "Sorry. During calculating bpm occured problem",
            error
        )))
    }  

}

