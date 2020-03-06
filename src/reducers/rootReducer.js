import { combineReducers } from "redux";
import decksReducer from "./decksReducer";
import mixerReducer from "./mixerReducer";
import searchReducer from "./searchReducer";
import playListReducer from "./playListReducer";

export default combineReducers({
    searchReducer,
    console : decksReducer, 
    playList: playListReducer,
    mixer: mixerReducer
})