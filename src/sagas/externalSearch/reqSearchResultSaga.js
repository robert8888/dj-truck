
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { call, put, takeEvery } from 'redux-saga/effects';
import { ACTIONS, pushLog, setSearchResults } from "./../../actions";
import { getApi } from './../../apis/apiProvider';
import { Log } from "./../../utils/logger/logger";

export default function* watcher() {
    yield takeEvery(ACTIONS.SEARCH_START, searchAsync);
}


function* searchAsync(action) {
    const path = ['saga', 'externalSearch', 'call to exteranl miusic source search api']
    const {text: query, source, limit} = action;
    try {
        yield put(showLoading());
        const api = getApi(source);
        const results = yield call(api.search, query, limit);
        yield put(setSearchResults(results));

        yield put(pushLog(
            new Log(`Successful recive search result for query${query} on source: ${source}`, path)
        ))
    } catch(error){
        yield put(pushLog(Log.Error(
            path,
            "Durring searching occured error: " + error.message,
            "Sorry. During process of searching track occurred a problem",
            error
        )))
    } finally {
        yield put(hideLoading())
    }
}