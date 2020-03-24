
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import { put , call} from 'redux-saga/effects';
import { search as ytSearch } from './../apis/yt/ytApi';
import { setSearchResults } from '../actions';

export default function *searchAsync(action){
    const queryString = action.text;
    try{
        yield put(showLoading());
        let serachResult = yield call(ytSearch, queryString);
        yield put(setSearchResults(serachResult));
    } finally {
        yield put(hideLoading())
    }

}

