const ACTIONS = {
    SET_GAIN : "Set $gain to $destination channel",
    SET_VOLUME: "Set $volume to $destination channel",
    SET_LOW : "Set $low to $destination channel",
    SET_HI : "Set $hi to $destination channel",
    SET_MID : "Set $mid to $destination channel",
    SET_FILTER : "Set $filter to $destination channel",
    SET_FILTER_RES : "Set filter $resonance to $destination channel ",
    SET_FADER : "Set $Fader to mixer",
    SET_SEND : "Set send $number, on $channel,  to $value",
    SET_CUE: "Set value of cue state on $channel, to $value",

    SET_CUE_ENABLED: "Set value of flag cue enabled"
}
export { ACTIONS as MIXER_ACTIONS }

export function setGain(destination, value){
    return { type: ACTIONS.SET_GAIN, destination, value }
}

export function setVolume(destination, value){
    return { type: ACTIONS.SET_VOLUME, destination, value }
}

export function setHi(destination, value){
    return { type: ACTIONS.SET_HI, destination, value }
};

export function setMid(destination, value){
    return {type: ACTIONS.SET_MID, destination, value }
};


export function setLow(destination, value){
    return { type: ACTIONS.SET_LOW, destination, value}
};

export function setFilter(destination, value){
    return { type: ACTIONS.SET_FILTER, destination, value}
};


export function setFilterResonans(destination, value){
    return { type: ACTIONS.SET_FILTER_RES, destination, value}
};

export function setFader(value){
    return { type: ACTIONS.SET_FADER, value}
};

export function setSend(destination, number, value){
    return { type: ACTIONS.SET_SEND, destination, number, value}
}

export function setCue(destination, value){
    return {type: ACTIONS.SET_CUE, destination, value}
}

export function setCueEnable(value){
    return {type: ACTIONS.SET_CUE_ENABLED, value}
}