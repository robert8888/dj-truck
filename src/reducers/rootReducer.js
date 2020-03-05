import { combineReducers } from "redux";
import consoleReducer from "./consoleReducer";
import searchReducer from "./searchReducer";
import playListReducer from "./playListReducer";

export default combineReducers({
    console : consoleReducer, 
    searchReducer,
    playList: playListReducer,
})