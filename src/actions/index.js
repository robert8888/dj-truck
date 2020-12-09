import { CONSOLE_ACTIONS as consoleActionTypes } from "./console/player";
import { EFFECTOR_ACTIONS as effectorActionTypes } from "./console/effector";
import { MASTERING_ACTIONS as masteringActionTypes } from "./console/mastering";
import { MIXER_ACTIONS as mixerActionTypes } from "./console/mixer";
import { PLAY_LIST_ACTIONS as playListActionTypes } from "./console/playlist";
import { RECORDER_ACTIONS as recorderActionTypes } from "./console/recorder";
import { SEARCHING_ACTIONS as searchActionTypes } from "./searching/searching";
import { LAYOUT_ACTIONS as layoutActionTypes } from "./layout/layout";
import { LOGGER_ACTIONS as loggerActionTypes } from "./logger/logger";
import { PROFILE_ACTIONS as userProfileActions } from "./profile/profile";
import { RECORDS_ACTIONS as recordsActions } from "./records/records";
import { USER_ACTIONS as userActions } from "./user/user";
import { CONTROL_ACTIONS as controlAction } from "./control/control.js";
import { NOTIFIER_ACTIONS as notifierActions } from "./notifications/notifications.js";

export { default as MAPPING} from "./control/MAPPING";

export const ACTIONS = {
    ...layoutActionTypes,
    ...loggerActionTypes,
    ...consoleActionTypes,
    ...searchActionTypes,
    ...playListActionTypes,
    ...mixerActionTypes,
    ...effectorActionTypes,
    ...masteringActionTypes,
    ...recorderActionTypes,
    ...controlAction,
    ...notifierActions,

    ...userActions,
    ...userProfileActions,

    ...recordsActions

}

export * from "./console/player";
export * from "./console/effector";
export * from "./console/mastering";
export * from "./console/mixer";
export * from "./console/playlist";
export * from "./console/recorder";
export * from "./searching/searching";
export * from "./layout/layout";
export * from "./logger/logger";
export * from "./profile/profile";
export * from "./records/records";
export * from "./user/user";
export * from "./control/control";
export * from "./notifications/notifications";



