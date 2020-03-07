
import { put , call} from 'redux-saga/effects';
import { search as ytSearch } from './../apis/yt/ytApi';
import { setSearchResults } from '../actions';

export default function *searchAsync(action){
    const queryString = action.text;
    let serachResult = yield call(ytSearch, queryString);
    yield put(setSearchResults(serachResult));
}

