//Actions types 
const  ACTIONS = {
    LOAD_TRACK : "Load $track to $destination channel",
    SET_LOADING_PROGRESS : "set $value of loading progress to $destination channel",
    SET_READY : "Set channel ready playBackStatus",
    SET_PITCH : "Settin $pitch to $destiantion channel", 
    SET_TIME_LEFT: "Sett $timeLEft to $destination channel",
    TOGGLE_PLAY : "Toggle $paused in  $destination chanell",
    TOGGLE_CUE : "Toggle $active_cue in  $destination chanel",
    CANCEL_CUE_AND_PLAY : "Set paused to false what triger play and after that set cueActive to false",
    SET_CUE_POINT : "Setting cue point from actual tarck position",
    INCREASE_PITCH : "Increasing Bpm on destination chanel",
    DECREASE_PITCH : "Decreasing Bpm on destination chanel",
    TOGGLE_SYNC: "Toggle $isSync state on $destynation channel",
    SET_MASTER: "set $master valeu to $destynation channel",
    SET_SYNC: "set sync $value to $destination channel ",

}
export {ACTIONS as CONSOLE_ACTIONS}
// ---------Console-Decks------------

export function loadTrack(track, destination ){
    return {
        type: ACTIONS.LOAD_TRACK,
        track: track,
        destination : destination
    }
}

export function setLoadingProgress(destination, value){
    return {
        type: ACTIONS.SET_LOADING_PROGRESS,
        destination,
        value,
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

export function increasePitch(destination, amount){
    return {
        type: ACTIONS.INCREASE_PITCH, 
        destination,
        amount
    }
}

export function decreasePitch(destination, amount){
    return {
        type: ACTIONS.DECREASE_PITCH, 
        destination,
        amount
    }
}

export function setMaster(destination){
    return {
        type: ACTIONS.SET_MASTER, 
        destination,
    }
}

export function toggleSync(destination){
    return {
        type: ACTIONS.TOGGLE_SYNC, 
        destination,
    }
}

export function setSync(destination,value){
    return {
        type: ACTIONS.SET_SYNC,
        destination,
        value
    }
}