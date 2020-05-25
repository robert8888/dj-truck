import { put, select, takeEvery } from "redux-saga/effects";
import { ACTIONS, pushLog } from "../../actions";
import { getApi } from "./../../apis/apiProvider";
import { Log } from "./../../utils/logger/logger";
import errorParser from "./../../utils/serverErrorParser/errorParser";

export default function* requestUpdateRecord() {
    yield takeEvery(ACTIONS.R_REC_FINAL_UPDATE, handel)
}

const getToken = state => state.user.token

const getTracklist = state =>
    state.recorder.tracklist
        .filter(track => (track.start !== undefined && track.start !== null))
        .map(track => ({
            id: track.id,
            start: track.start,
            end: track.end
        }))
        .map(track => {
            console.log(track)
            if (!track.end) {
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
                fileSize: variables.fileSize,
            } = action);

            const tracks = yield select(getTracklist);
            variables.tracks = tracks;

            const response = yield callQuery(query, token, variables);

            if (response.errors) {
                throw new Error('Server response contains errors ', + errorParser(response.errors))
            }

            const success = response?.data?.updateRecord;

            if(!success){
                throw new Error();
            }

            yield put(pushLog(
                    new Log(`Record metadata updated successful id: ${variables.id}`)
                ))
        } catch (error) {
            yield put(pushLog(Log.Error(
                ['saga', 'recorder', 'request update record'],
                "Can't update record data in database" + error.message,
                "Sorry. During process of updating record metadata occurred a problem",
                error
            )))
        }

    }

}

