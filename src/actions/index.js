import {CONSOLE_ACTIONS as consoleActionTypes } from "./consoleDecks";
import {SEARCHING_ACTIONS as searchActionTypes } from "./searching";
import {PLAY_LIST_ACTIONS as playListActionTypes } from "./playList";
import {MIXER_ACTIONS as mixerActionTypes } from "./mixer";
import {EFFECTOR_ACTIONS as effectorActionTypes} from "./effector";
import {MASTERING_ACTIONS as masteringActionTypes} from "./mastering";

export const ACTIONS = {
    ...consoleActionTypes,
    ...searchActionTypes,
    ...playListActionTypes,
    ...mixerActionTypes,
    ...effectorActionTypes,
    ...masteringActionTypes
}

export * from "./consoleDecks";
export * from "./searching";
export * from "./playList";
export * from "./mixer";
export * from "./effector";
export * from "./mastering";