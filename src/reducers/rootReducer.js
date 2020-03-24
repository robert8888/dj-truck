import { combineReducers } from "redux";
import { loadingBarReducer } from 'react-redux-loading-bar'
import decksReducer from "./decksReducer";
import mixer from "./mixerReducer";
import effector from "./effectorReducer";
import searchReducer from "./searchReducer";
import playList from "./playListReducer";
import configuration from "./configurationReducer";

export default combineReducers({
    searchReducer,
    console : decksReducer, 
    playList,
    mixer,
    effector,
    configuration,
    
    loadingBar: loadingBarReducer,
})