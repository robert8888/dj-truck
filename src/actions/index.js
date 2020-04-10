import {CONSOLE_ACTIONS as consoleActionTypes } from "./console/consoleDecks";
import {SEARCHING_ACTIONS as searchActionTypes } from "./console/searching";
import {PLAY_LIST_ACTIONS as playListActionTypes } from "./console/playList";
import {MIXER_ACTIONS as mixerActionTypes } from "./console/mixer";
import {EFFECTOR_ACTIONS as effectorActionTypes} from "./console/effector";
import {MASTERING_ACTIONS as masteringActionTypes} from "./console/mastering";

import {USER_ACTIONS as userProfileActions} from "./user/user"

export const ACTIONS = {
    ...consoleActionTypes,
    ...searchActionTypes,
    ...playListActionTypes,
    ...mixerActionTypes,
    ...effectorActionTypes,
    ...masteringActionTypes,

    ...userProfileActions,
}

export * from "./console/consoleDecks";
export * from "./console/searching";
export * from "./console/playList";
export * from "./console/mixer";
export * from "./console/effector";
export * from "./console/mastering";

export * from "./user/user";



