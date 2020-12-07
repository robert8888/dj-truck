import { put, select, takeEvery } from "redux-saga/effects";
import {ACTIONS, pushLog, setBpmAndOffset} from "actions";
import {Log} from "utils/logger/logger";

export default function* updateBpmOrOffset() {
    yield takeEvery(ACTIONS.PL_SET_DECK_BPM_OR_OFFSET, handle)
}

const selectTrackOffset = (state, channel) =>{
    return state.console.channel[channel].playBackState.offset ;
}

const selectTrackBpm = (state, channel) =>{
    return state.console.channel[channel].track.bpm;
}

const selectTrackId = (state, channel) => {
    return state.console.channel[channel].track.id;
}

const selectCurrentPlaylist = (state) => {
    return state.playList.currentPlaylist;
}

function* handle(action) {
     const path = ['saga', 'playlist', 'update bpm or offset']
     try{
         let {destination: channel, offset, bpm} = action;
         if(bpm && (offset !== null && offset !== undefined)){
             return;
         }

         const trackId = yield select(selectTrackId, channel);
         const playlist = yield select(selectCurrentPlaylist);

         if(!trackId || !playlist) return;

         if(!offset) {
             offset = yield select(selectTrackOffset, channel);
         }else if(!bpm){
             bpm = yield select(selectTrackBpm, channel);
             const beat = 60 / bpm;
             offset = offset % beat;
         }

         yield put(setBpmAndOffset(trackId, playlist, bpm, offset))
     } catch(error){
         yield put(pushLog(Log.Error(
             path,
             "Can't update bpm or offset" + error.message,
             "Sorry. During process of updating track bpm occurred a problem",
             error
         )))
     }
}

