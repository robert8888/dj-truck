const ACTIONS = {
    SET_GAIN : "Set $gain to $destination channel",

    SET_LOW : "Set $low to $destination channel",
    SET_HI : "Set $hi to $destination channel",
    SET_MID : "Set $mid to $destination channel",
    SET_FADER : "Set $Fader to mixer",
}
export {ACTIONS as MIXER_ACTIONS }

export function setGain(destination, value){
    return {
        type: ACTIONS.SET_GAIN,
        destination,
        value
    }
};
export function setHi(destination, value){
    return {
        type: ACTIONS.SET_HI,
        destination,
        value
    }
};

export function setMid(destination, value){
    return {
        type: ACTIONS.SET_MID,
        destination,
        value
    }
};


export function setLow(destination, value){
    return {
        type: ACTIONS.SET_LOW,
        destination,
        value
    }
};

export function setFader(value){
    return {
        type: ACTIONS.SET_FADER,
        value
    }
};


