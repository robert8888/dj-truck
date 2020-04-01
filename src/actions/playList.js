// ---------- PlayList---------------------

const ACTIONS = {
    PUSH_TRACK : "Push tack on end of list",
    //"Affter append track to list is fire calculating Bpm, after witch is seting bpm to track on list"
    CALC_BPM : "Start calculating bpm for track",
    SET_BPM_AND_OFFSET : "Update Bpm and Offset track on playlist", // bpm is rounded

    //---play list explorer
    PL_CREATE_DIR : "Create dir in current",
    PL_CREATE_PLAYLIST: "Creawte play list in current selected dir of name",

    PL_SET_SELECTION : "Set current selected dir and play list if is selected play list",
    PL_OPEN_CURRENT_PLAY_LIST: "Open/explore current play list",
    PL_TOGGLE_DIR: "Open if is closed an vice versa by path",
    PL_RENAME_SELECTED: "Rename current selected element",
    PL_DELETE_SELECTED: "Remove current selected element",
    PL_DELETE_TRACK : "Remove track of given index from current playlist",
    PL_SWAP_TRACK_ON_CURRENT: "Swap elements on current play list",
    PL_ADD_TRACK_TO_LIST : "Add track to list (from drag and drop)",
    PL_MOVE_TO : "Move element of pathFrom to pathTo (from drag and drop)",
}
export {ACTIONS as PLAY_LIST_ACTIONS }
//***------------------- */
export function pushTrackToList(track, playlist){
    return {
        type: ACTIONS.PUSH_TRACK,
        track,
        playlist
    }
};

export function startCalcBpm(track, playlist){
    return {
        type: ACTIONS.CALC_BPM,
        track,
        playlist
    }
}


export function setBpmAndOffset(id, playlist,  bpm, offset){
    return {
        type: ACTIONS.SET_BPM_AND_OFFSET,
        id,
        playlist,
        bpm,
        offset,
    }
}

/**---------------------- */

export function createDir(name){
    return {
        type: ACTIONS.PL_CREATE_DIR,
        name,
    }
}

export function createPlaylist(name){
    return {
        type: ACTIONS.PL_CREATE_PLAYLIST,
        name,
    }
}

export function setSelection(path){
    return {
        type: ACTIONS.PL_SET_SELECTION,
        path,
    }
}

export function openCurrentPlayList(){
    return {
        type: ACTIONS.PL_OPEN_CURRENT_PLAY_LIST,
    }
}

export function toggleDir(path){
    return {
        type: ACTIONS.PL_TOGGLE_DIR,
        path
    }
}


export function deleteSelected(){
    return {
        type: ACTIONS.PL_DELETE_SELECTED
    }
}

export function deleteTrack(index){
    return {
        type: ACTIONS.PL_DELETE_TRACK,
        index
    }
}

export function renameSelected(name){
    return {
        type: ACTIONS.PL_RENAME_SELECTED,
        name
    }
}

export function swapTrackOnList(from, to){
    return {
        type: ACTIONS.PL_SWAP_TRACK_ON_CURRENT,
        from,
        to
    }
}

export function addTrackToList(track, path){
    return{
        type: ACTIONS.PL_ADD_TRACK_TO_LIST,
        track,
        path
    }
}

export function moveTo(pathFrom, pathTo){
    return{
        type: ACTIONS.PL_MOVE_TO,
        pathFrom,
        pathTo
    }
}