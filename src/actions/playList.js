// ---------- PlayList---------------------

const ACTIONS = {
    PUSH_TRACK : "Push tack on end of list",
    //"Affter append track to list is fire calculating Bpm, after witch is seting bpm to track on list"
    SET_BPM : "Update Bpm track on playlist",
    SET_BPM_AND_OFFSET : "Update Bpm and Offset track on playlist", // bpm is rounded
}
export {ACTIONS as PLAY_LIST_ACTIONS }

export function pushTrackToList(track){
    return {
        type: ACTIONS.PUSH_TRACK,
        track
    }
};

export function setBpm(source, id, bpm){
    return {
        type: ACTIONS.SET_BPM,
        source,
        id,
        bpm,
    }
}

export function setBpmAndOffset(source, id, bpm, offset){
    return {
        type: ACTIONS.SET_BPM_AND_OFFSET,
        source,
        id,
        bpm,
        offset,
    }
}