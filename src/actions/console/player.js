//Actions types 
const  ACTIONS = {
    LOAD_TRACK : "Load $track to $destination channel",
    SET_LOADING_PROGRESS : "set $value of loading progress to $destination channel",
    SET_PROCESSING : "set $value of processing state to $destination channel",
    SET_READY : "Set channel ready playBackStatus",
    SET_PITCH : "Setting $pitch to $destination channel",
    SET_PITCH_TEMP: "Set $pitch to $destination channel temporary",
    SET_TIME_LEFT: "Sett $timeLEft to $destination channel",
    SET_TIME_WARNING: "Setting $value of tracks is ending warning for $destination channel",
    TOGGLE_PLAY : "Toggle $paused in  $destination channel",
    TOGGLE_CUE : "Toggle $active_cue in  $destination channel",
    CANCEL_CUE_AND_PLAY : "Set paused to false what trigger play and after that set cueActive to false",
    SET_CUE_POINT : "Setting cue point from actual track position",
    INCREASE_PITCH : "Increasing Bpm on destination channel",
    DECREASE_PITCH : "Decreasing Bpm on destination channel",
    TOGGLE_SYNC: "Toggle $isSync state on $destination channel",
    SET_MASTER: "set $master value to $destination channel",
    SET_SYNC: "set sync $value to $destination channel ",
    SET_LOOP: "set $value to loop variable on $destination channel",
    SET_LOOP_LENGTH : "set $loopLength to $destination channel",
    SET_ZOOM: "set value of zoom fot $destination channel",


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

export function setProcessing(destination, value){
    return {type: ACTIONS.SET_PROCESSING, destination, value}
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

export function setPitchTemp( destination, about){
    return {
        type: ACTIONS.SET_PITCH_TEMP,
        destination, about
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
    return {type: ACTIONS.SET_TIME_LEFT, destination , timeLeft}
}


export function setTimeWarning(destination, value){
    return {type: ACTIONS.SET_TIME_WARNING, destination, value}
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

export function setZoom(destination, operation){
    return {
        type: ACTIONS.SET_ZOOM, destination, operation
    }
}


export function consoleStopAll(){
    return {type: ACTIONS.CONSOLE_STOP_ALL};
}

export function consoleResetChannels(){
    return {type: ACTIONS.CONSOLE_RESET}
}