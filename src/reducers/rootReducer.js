import { combineReducers } from "redux";
import decksReducer from "./decksReducer";
import searchReducer from "./searchReducer";
import playListReducer from "./playListReducer";

export default combineReducers({
    console : decksReducer, 
    searchReducer,
    playList: playListReducer,
})