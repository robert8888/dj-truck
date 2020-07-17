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
    SET_LOOP: "set $value to loop variable on $destination channel",
    SET_LOOP_LENGTH : "set $loopLenght to $destination channel",
    SET_IN_KEY: "set mixing in key flag $value for $destination channel",

    CONSOLE_STOP_ALL: "stop playback clear deck stop recording",
    CONSOLE_RESET : 'stop playing track and clear track from channel',

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


export function setPitch( destination, pitch){
    return {
        type: ACTIONS.SET_PITCH,
        pitch: pitch,
        destination: destination
    }
}

export function togglePlay(destination, value){
    return {
        type: ACTIONS.TOGGLE_PLAY,
        destination : destination,
        value
    }
}


export function toggleCue(destination, value){
    return {
        type: ACTIONS.TOGGLE_CUE,
        destination : destination,
        value
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

export function setMaster(destination, value){
    return {
        type: ACTIONS.SET_MASTER, 
        destination,
        value
    }
}

export function toggleSync(destination, value){
    return {
        type: ACTIONS.TOGGLE_SYNC, 
        destination,
        value
    }
}

export function setSync(destination, value){
    return {
        type: ACTIONS.SET_SYNC,
        destination,
        value
    }
}

export function setLoop(destination, value){
    return {
        type : ACTIONS.SET_LOOP,
        destination,
        value
    }
}

export function setLoopLength(destination, value){
    return {
        type : ACTIONS.SET_LOOP_LENGTH,
        destination,
        value
    }
}

export function setPitchInKey(destination, value){
    return {
        type: ACTIONS.SET_IN_KEY, destination, value
    }
}


export function consoleStopAll(){
    return {type: ACTIONS.CONSOLE_STOP_ALL};
}

export function consoleResetChannels(){
    return {type: ACTIONS.CONSOLE_RESET}
}