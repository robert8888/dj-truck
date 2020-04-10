// ---------- PlayList---------------------

const ACTIONS = {
    PL_ROOT_REQUEST: "Call to api for root dir content",
    PL_LOAD_DIR_REQUEST: "call to api for dir conent",
    PL_PUSH_DIR_CONTENT: "Push  director contetn loaded  from api",
   
    PL_PUSH_TRACK_REQUEST: "Call to api and add track to current playlist",
    PUSH_TRACK: "Push tack on end of list",
    //"Affter append track to list is fire calculating Bpm, after witch is seting bpm to track on list"
    CALC_BPM: "Start calculating bpm for track",
    SET_BPM_AND_OFFSET: "Update Bpm and Offset track on playlist", // bpm is rounded

    //---play list explorer
    PL_CREATE_DIR_REQEST: "Call to api and create dir",
    PL_CREATE_DIR: "Create dir in current",
    PL_CREATE_PLAYLIST_REQUEST: "Call to api to create playlist in current selected dir of name",
    PL_CREATE_PLAYLIST: "Create play list in current selected dir of name",

    PL_SET_SELECTION: "Set current selected dir and play list if is selected play list",

    PL_LOAD_CURRENT_PLAYLIST_REQUEST: "Call to api to get current playlist content",
    PL_SET_CURRENT_PLAYLIST_CONTENT: "Setinng content of current playlist from api",
    PL_OPEN_CURRENT_PLAY_LIST: "Open/explore current play list",

    PL_TOGGLE_DIR_REQUEST: "If is not loade load and then open",
    PL_TOGGLE_DIR: "Open if is closed an vice versa by path",

    PL_RENAME_SELECTED_REQUEST : "Call to api to rename current selected",
    PL_RENAME_SELECTED: "Rename current selected element",
    
    PL_DELETE_SELECTED_REQUEST: "Call to api and delete current selected element",
    PL_DELETE_SELECTED: "Remove current selected element",

    PL_DELETE_TRACK: "Remove track of given index from current playlist",
    PL_SWAP_TRACK_ON_CURRENT: "Swap elements on current play list",
    PL_ADD_TRACK_TO_LIST: "Add track to list (from drag and drop)",
    PL_MOVE_TO: "Move element of pathFrom to pathTo (from drag and drop)",
}
export { ACTIONS as PLAY_LIST_ACTIONS }
//***------------------- */
export function rootDirRequest() {
    return { type: ACTIONS.PL_ROOT_REQUEST }
}

export function loadDirRequest(path, open){
    return { type: ACTIONS.PL_LOAD_DIR_REQUEST, path, open }
}

export function pushDirContent(dirContent, isRoot , path, open) {
    return { type: ACTIONS.PL_PUSH_DIR_CONTENT, dirContent, isRoot, path , open }
}

export function pushTrackToListRequest(track, playlist) {
    return { type: ACTIONS.PL_PUSH_TRACK_REQUEST, track, playlist }
};

export function pushTrackToList(track, playlist) {
    return { type: ACTIONS.PUSH_TRACK, track, playlist }
};

export function startCalcBpm(track, playlist) {
    return {
        type: ACTIONS.CALC_BPM,
        track,
        playlist
    }
}


export function setBpmAndOffset(id, playlist, bpm, offset) {
    return {
        type: ACTIONS.SET_BPM_AND_OFFSET,
        id,
        playlist,
        bpm,
        offset,
    }
}

/**---------------------- */

export function createDirRequest(name) {
    return { type: ACTIONS.PL_CREATE_DIR_REQEST, name }
}

export function createDir(name, id, renameMode) {
    return { type: ACTIONS.PL_CREATE_DIR, name, id, renameMode }
}

export function createPlaylistRequest(name) {
    return { type: ACTIONS.PL_CREATE_PLAYLIST_REQUEST, name }
}

export function createPlaylist(name, id , renameMode, setCurrent) {
    return { type: ACTIONS.PL_CREATE_PLAYLIST, name, id, renameMode, setCurrent }
}

export function setSelection(path) {
    return { type: ACTIONS.PL_SET_SELECTION,  path }
}




export function openCurrentPlaylistRequest(){
    return { type: ACTIONS.PL_LOAD_CURRENT_PLAYLIST_REQUEST }
}

export function setCurretPlaylistContent(playlistContent){
    return { type: ACTIONS.PL_SET_CURRENT_PLAYLIST_CONTENT, playlistContent}
}

export function openCurrentPlaylist() {
    return { type: ACTIONS.PL_OPEN_CURRENT_PLAY_LIST }
}


export function toggleDirRequest(path) {
    return { type: ACTIONS.PL_TOGGLE_DIR_REQUEST, path }
}


export function toggleDir(path) {
    return { type: ACTIONS.PL_TOGGLE_DIR, path }
}



export function deleteSelectedRequest(){
    return { type: ACTIONS.PL_DELETE_SELECTED_REQUEST }
}

export function deleteSelected() {
    return { type: ACTIONS.PL_DELETE_SELECTED }
}

export function deleteTrack(index) {
    return {
        type: ACTIONS.PL_DELETE_TRACK,
        index
    }
}

export function renameSelectedRequest(name) {
    return { type: ACTIONS.PL_RENAME_SELECTED_REQUEST, name }
}

export function renameSelected(name) {
    return { type: ACTIONS.PL_RENAME_SELECTED, name }
}


export function swapTrackOnList(from, to) {
    return {
        type: ACTIONS.PL_SWAP_TRACK_ON_CURRENT,
        from,
        to
    }
}

export function addTrackToList(track, path) {
    return {
        type: ACTIONS.PL_ADD_TRACK_TO_LIST,
        track,
        path
    }
}

export function moveTo(pathFrom, pathTo) {
    return {
        type: ACTIONS.PL_MOVE_TO,
        pathFrom,
        pathTo
    }
}