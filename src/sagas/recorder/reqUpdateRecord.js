import { ACTIONS } from "../../actions";
import { takeEvery, select } from "redux-saga/effects";
import { getApi } from "./../../apis/apiProvider";


export default function* requestUpdateRecord() {
    yield takeEvery(ACTIONS.R_REC_FINAL_UPDATE, handel)
}

const getToken = state => state.user.token

const getTracklist = state => 
    state.recorder.tracklist
    .filter( track => (track.start !== undefined && track.start !== null))
    .map(track => ({
        id: track.id,
        start: track.start,
        end: track.end
    }))
    .map(track => {
        console.log(track)
        if(!track.end){
            track.end = (new Date().getTime() - state.recorder.startTime) / 1000;
        }
        return track;
    })

function* handel(action) {
    const token = yield select(getToken);

    if (token) {
        try {
            const { callQuery, queries } = getApi("UserAssets");
            const query = queries.updateRecordQl;
            const variables = {};
            ({
                id: variables.id,
                peaks: variables.peaks,
                duration: variables.duration,
                fileSize: variables.fileSize
            } = action);
            const tracks = yield select(getTracklist);
            variables.tracks = tracks;
          
            const result = yield callQuery(query, token, variables);
    
            const succes = result?.data?.updateRecord;
            if (!result.errors && succes) {

            } else {
                console.log('Update record metadata fail')
            }
        } catch {

        }

    }

}

