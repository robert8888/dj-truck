import { format } from 'date-fns';
import { put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, pushLog, recordingRquestFail, startRecording } from "actions";
import { getApi } from "./../../apis/apiProvider";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";

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
    const path = ['saga', 'recorder', 'request created record']
    if(token){
        try{
            const { callQuery , queries } = getApi("UserAssets");
            let title = action.recName?.split("_").join(" ") || "Record " + format(new Date(), 'yy-MM-dd HH:mm')
            const query = queries.createRecordQl(title);
            const response = yield callQuery(query, token);
            const id = response?.data?.createRecord?.id;

            if (response.errors) {
                throw new Error('Server response contains errors '+ errorParser(response.errors))
            }

            if(id === null || id === undefined){
                throw new Error("Record id undefined. Probably occure problem during creating record on server")
            } 

            const tracklist = yield select(getInitTracklist) || [];

            yield put(startRecording(title, id, tracklist))

            yield put(pushLog(new Log(`Record successful crated in database id: ${id}`, path)))  
            
        } catch(error) {
            yield put(recordingRquestFail());

            yield put(pushLog(Log.Error(
                path,
                "Can't create record data in database" + error.message,
                "Sorry. During process of creating record occurred a problem",
                error
            )))
        }

    }

}

