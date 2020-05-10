import {  ACTIONS,  startRecording, recordingRquestFail } from "../../actions";
import { takeEvery, select, put,} from "redux-saga/effects";
import { getApi } from "./../../apis/apiProvider";
import { format } from 'date-fns'

export default function* requestCreatedRecord() {
    yield takeEvery(ACTIONS.R_CREATE_RECORD_REQEST, handel)
}

const getToken = state => state.user.token


const getInitTracklist = state => {
    let tracks = []
    for(let channelName in state.console.channel){
        let channel = state.console.channel[channelName];
        if(channel.track.id){
            let track  = {
                id: channel.track.id,
                channel: channelName,
            }
            if(!channel.playBackState.paused){
                track.start = 0;
                track.playedTime  = channel.track.duration - channel.playBackState.timeLeft;
            } else {
                track.start = null;
                track.playedTime = Infinity;
            }
            tracks.push(track);
        }
    }
    tracks.sort((a, b) => a.playedTime - b.playedTime)
            .map(track => ({
                id: track.id,
                channel: track.channel,
                start: track.start,
            }))
    return tracks;
}

function* handel(action) {
    const token = yield select(getToken);

    if(token){
        try{
            const { callQuery , queries } = getApi("UserAssets");
            let title = action.recName?.split("_").join(" ") || "Record " + format(new Date(), 'yy-MM-dd HH:mm')
            const query = queries.createRecordQl(title);
            const result = yield callQuery(query, token);
            const id = result?.data?.createRecord?.id;
            let tracklist = [];
            if(id){
                tracklist = yield select(getInitTracklist);
            }

            if(!result.errors && id){
                yield put(startRecording(title, id, tracklist))
            } else {
                throw new Error("Create new record metadata fails")
            }  
        } catch {
            yield put(recordingRquestFail())
        }

    }

}

