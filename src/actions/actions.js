//Actions types 
let ACTIONS = {
    LOAD_TRACK : "Load $track to $destination channel",
    SET_READY : "Set channel ready playBackStatus",
    SET_PITCH : "Settin $pitch to $destiantion channel", 
    SET_TIME_LEFT: "Sett $timeLEft to $destination channel",
    TOGGLE_PLAY : "Toggle $paused in  $destination chanell",
    TOGGLE_CUE : "Toggle $active_cue in  $destination chanel",
    CANCEL_CUE_AND_PLAY : "Set paused to false what triger play and after that set cueActive to false",
    SET_CUE_POINT : "Setting cue point from actual tarck position",
    INCREASE_BPM : "Increasing Bpm on destination chanel",
    DECREASE_BPM : "Decreasing Bpm on destination chanel"
}

// ---------Console-------------

export function loadTrack(track, destination ){
    return {
        type: ACTIONS.LOAD_TRACK,
        track: track,
        destination : destination
    }
}

export function setChannelReady(value, destination){
    return {
        type: ACTIONS.SET_READY,
        value: value,
        destination : destination
    }
}


export function setPitch(pitch, destination){
    return {
        type: ACTIONS.SET_PITCH,
        pitch: pitch,
        destination: destination
    }
}

export function togglePlay(destination){
    return {
        type: ACTIONS.TOGGLE_PLAY,
        destination : destination,
    }
}


export function toggleCue(destination){
    return {
        type: ACTIONS.TOGGLE_CUE,
        destination : destination,
    }
}

export function canelCueAndPlay(destination){
    return {
        type: ACTIONS.CANCEL_CUE_AND_PLAY,
        destination : destination,
    }
}

export function setCuePoint(destination, position){
    return {
        type: ACTIONS.SET_CUE_POINT,
        destination : destination,
        position: position
    }
}

export function setTimeLeft(destination, timeLeft){
    return {
        type: ACTIONS.SET_TIME_LEFT,
        destination : destination, 
        timeLeft : timeLeft
    }
}

export function increaseBpm(destination, amount){
    return {
        type: ACTIONS.INCREASE_BPM, 
        destination,
        amount
    }
}

export function decreaseBpm(destination, amount){
    return {
        type: ACTIONS.DECREASE_BPM, 
        destination,
        amount
    }
}
//--------- Serching----------------

ACTIONS = {
    ...ACTIONS,
    SEARCH_INPUT : "Tap in to Search component",
    SET_SEARCH_RESULTS : "Set YT(or oteher source) search results",
    SEARCH_START : "Fire seraching",
    CLEAR_SERACH : "Clear search string and serach result set"
}

export function searchInput(text){
    return {
        type: ACTIONS.SEARCH_INPUT,
        text: text
    }
}

export function searchStart(text){
    return { 
        type : ACTIONS.SEARCH_START,
        text : text
    }
}

export function setSearchResults(results){
    return {
        type: ACTIONS.SET_SEARCH_RESULTS,
        results : results,
    }
}

export function clearSearch(){
    return {
        type : ACTIONS.CLEAR_SERACH
    }
}

// ---------- PlayList---------------------

ACTIONS = {
    ...ACTIONS,
    PUSH_TRACK : "Push tack on end of list",
    //"Affter append track to list is fire calculating Bpm, after witch is seting bpm to track on list"
    SET_BPM : "Update Bpm track on playlist",
    SET_BPM_AND_OFFSET : "Update Bpm and Offset track on playlist", // bpm is rounded
}

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


export { ACTIONS }