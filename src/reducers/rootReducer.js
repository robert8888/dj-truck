import { loadingBarReducer } from 'react-redux-loading-bar';
import { combineReducers } from "redux";
import configuration from "./console/configurationReducer";
import console from "./console/decksReducer";
import effector from "./console/effectorReducer";
import mastering from "./console/masteringReducer";
import mixer from "./console/mixerReducer";
import control from "./control/controlReducer";
import playList from "./console/playlist/playlistReducer";
import recorder from "./console/recorder/recorderReducer";
import searchReducer from "./console/searchReducer";
import layout from "./layout/layoutReducer";
import logger from "./logger/loggerReducer";
import profile from "./profile/profileReducer";
import records from "./records/recordsReducer";
import user from "./user/userReducer";
import notifier from "./notifier/notifier";

export default combineReducers({
    notifier,
    logger,
    searchReducer,
    console, 
    playList,
    mixer,
    effector,
    configuration,
    mastering,
    control,
    recorder,
    //------
    records,
    //--------------
    user,
    profile,
    //-----------------
    loadingBar: loadingBarReducer,
    layout
})