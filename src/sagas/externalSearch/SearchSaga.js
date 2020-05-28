
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { call, put, takeEvery } from 'redux-saga/effects';
import { ACTIONS, setSearchResults } from "../../actions";
import { getApi } from './../../apis/apiProvider';

export default function* watcher() {
    console.log("acitons yt serch")
    yield takeEvery(ACTIONS.SEARCH_START, searchAsync);
}


function* searchAsync(action) {
    const {text: query, source, limit} = action;
    console.log("soruce", source)


    try {
        yield put(showLoading());
        const api = getApi(source);
        const results = yield call(api.search, query, limit);
       // let serachResult = yield call(ytSearch, query);
        yield put(setSearchResults(results));
    } finally {
        yield put(hideLoading())
    }
}