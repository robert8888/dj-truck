const ACTIONS = {
    R_CREATE_RECORD_REQEST : "Create recording metada",
    R_START_RECORDING : "Start prepering ws recorder conection",
    R_END_RECORDING: "Stop recording",
    R_RECORDING: "Is recording",
    R_RECORDING_FAIL: "indicates error during connections or creating objects",
    R_ROLLBACk_REC: "removing rec metada in resopones comporesing or sending to database error",

    R_REC_FINAL_UPDATE : "Set peaks array and time to recording",


    R_PUSH_TO_TRACKLIST:  'push track to end of current playlist',
    R_UPDATE_START: 'update start time of track on tracklist - after start playling',
    R_UPDATE_END: 'update end position of track after end playing or force load new',
}
export {ACTIONS as RECORDER_ACTIONS};

export function createRecordinRequest(recName){
    return { type: ACTIONS.R_CREATE_RECORD_REQEST, recName }
}

export function startRecording(recName, id, initTracklist){
    return { type: ACTIONS.R_START_RECORDING, recName, id, initTracklist }
}

export function endRecording(){
    return { type: ACTIONS.R_END_RECORDING}
}

export function recording(){
    return {type: ACTIONS.R_RECORDING}
}

export function recordingRquestFail(){
    return {type: ACTIONS.R_RECORDING_FAIL}
}

export function recordFinalUpdate(id, peaks, duration, fileSize){
    return {type: ACTIONS.R_REC_FINAL_UPDATE, id, peaks, duration, fileSize}
}

export function roolbackRecord(id){
    return {type: ACTIONS.R_ROLLBACk_REC, id}
}


export function pushToTracklist(track){
    return {type: ACTIONS.R_PUSH_TO_TRACKLIST, track}
}

export function updateStartTime(id){
    return {type: ACTIONS.R_UPDATE_START, id}
}

export function updateEndTime(id){
    return {type: ACTIONS.R_UPDATE_END, id}
}
