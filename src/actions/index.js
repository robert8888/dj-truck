import { CONSOLE_ACTIONS as consoleActionTypes } from "./console/consoleDecks";
import { EFFECTOR_ACTIONS as effectorActionTypes } from "./console/effector";
import { MASTERING_ACTIONS as masteringActionTypes } from "./console/mastering";
import { MIXER_ACTIONS as mixerActionTypes } from "./console/mixer";
import { PLAY_LIST_ACTIONS as playListActionTypes } from "./console/playList";
import { RECORDER_ACTIONS as recorderActionTypes } from "./console/recorder";
import { SEARCHING_ACTIONS as searchActionTypes } from "./externalSearch/searching";
import { LAYOUT_ACTIONS as layoutActionTypes } from "./layout/layout";
import { LOGGER_ACTIONS as loggerActionTypes } from "./logger/logger";
import { PROFILE_ACTIONS as userProfileActions } from "./profile/profile";
import { RECORDS_ACTIONS as recordsActios } from "./records/records";
import { USER_ACTIONS as userActions } from "./user/user";
import { CONTROL_MIDI_ACTIONS as midiControlAction } from "./control/midi";

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
    ...midiControlAction,

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
export * from "./externalSearch/searching";
export * from "./layout/layout";
export * from "./logger/logger";
export * from "./profile/profile";
export * from "./records/records";
export * from "./user/user";
export * from "./control/midi";




