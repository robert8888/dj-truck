import { combineReducers } from "redux";

// -- layout
import { loadingBarReducer } from 'react-redux-loading-bar'
import header from "./layoutState/headerStateReducer";

//console
import decksReducer from "./console/decksReducer";
import mixer from "./console/mixerReducer";
import effector from "./console/effectorReducer";
import searchReducer from "./console/searchReducer";
import playList from "./console/playlist/playlistReducer";
import configuration from "./console/configurationReducer";
import mastering from "./console/masteringReducer";

import user from "./user/userReducer";

export default combineReducers({
    searchReducer,
    console : decksReducer, 
    playList,
    mixer,
    effector,
    configuration,
    mastering,
    //--------------
    user,

    //-----------------
    loadingBar: loadingBarReducer,
    header,
})