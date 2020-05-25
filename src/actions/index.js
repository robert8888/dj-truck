import { CONSOLE_ACTIONS as consoleActionTypes } from "./console/consoleDecks";
import { EFFECTOR_ACTIONS as effectorActionTypes } from "./console/effector";
import { MASTERING_ACTIONS as masteringActionTypes } from "./console/mastering";
import { MIXER_ACTIONS as mixerActionTypes } from "./console/mixer";
import { PLAY_LIST_ACTIONS as playListActionTypes } from "./console/playList";
import { RECORDER_ACTIONS as recorderActionTypes } from "./console/recorder";
import { SEARCHING_ACTIONS as searchActionTypes } from "./console/searching";
import { LOGGER_ACTIONS as loggerActionTypes } from "./loger/loger";
import { PROFILE_ACTIONS as userProfileActions } from "./profile/profile";
import { RECORDS_ACTIONS as recordsActios } from "./records/records";
import { USER_ACTIONS as userActions } from "./user/user";


export const ACTIONS = {
    ...loggerActionTypes,
    ...consoleActionTypes,
    ...searchActionTypes,
    ...playListActionTypes,
    ...mixerActionTypes,
    ...effectorActionTypes,
    ...masteringActionTypes,
    ...recorderActionTypes,

    ...userActions,
    ...userProfileActions,

    ...recordsActios
}

export * from "./console/consoleDecks";
export * from "./console/effector";
export * from "./console/mastering";
export * from "./console/mixer";
export * from "./console/playList";
export * from "./console/recorder";
export * from "./console/searching";
export * from "./loger/loger";
export * from "./profile/profile";
export * from "./records/records";
export * from "./user/user";




