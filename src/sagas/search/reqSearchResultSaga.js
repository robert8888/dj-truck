
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { call, put, takeEvery } from 'redux-saga/effects';
import {ACTIONS, pushLog, setSearchResults, setSearchStatus} from "../../actions";
import { getApi } from '../../apis/apiProvider';
import { Log } from "../../utils/logger/logger";

export default function* watcher() {
    yield takeEvery(ACTIONS.SEARCH_START, searchAsync);
}

function* searchAsync(action) {
    const path = ['saga', 'externalSearch', 'call to external music source search api']
    const {text: query, source, limit} = action;
    try {
        yield put(showLoading());
        yield put(setSearchStatus("fetching"))
        const api = getApi(source);
        const results = yield call(api.search, query, limit);
        
        if(results.error){
            throw new Error(JSON.stringify(results.error));
        }

        yield put(setSearchResults(results));

        if(!results.length)
            yield put(setSearchStatus("fail"))

        yield put(pushLog(
            new Log(`Successful receive search result for query${query} on source: ${source}`, path)
        ))
    } catch(error){
        yield put(pushLog(Log.Error(
            path,
            "During searching occurred error: " + error.message,
            "Sorry. During process of searching track occurred a problem",
            error
        )))
        yield put(setSearchStatus("fail"))
    } finally {
        yield put(hideLoading())
    }
}