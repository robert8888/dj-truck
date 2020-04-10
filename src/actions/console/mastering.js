const ACTIONS = {
    SET_PRE_GAIN : "Set $value of pre compressor gain",
    SET_POST_GAIN : "Set $value of post compressor gain",

    SET_THRESHOLD : "Set $value of compressor threshold",
    SET_RATIO : "Set $value of compressor ratio",
    SET_ATTACK : "Set $value of compressora attack",
    SET_RELEASE : "Set $value of compressor release",

}
export {ACTIONS as MASTERING_ACTIONS }

export function setPreGain(value){
    return {
        type: ACTIONS.SET_PRE_GAIN,
        value
    }   
};

export function setPostGain(value){
    return {
        type: ACTIONS.SET_POST_GAIN,
        value
    }   
};

export function setThreshold(value){
    return {
        type: ACTIONS.SET_THRESHOLD,
        value
    }   
};

export function setRatio(value){
    return {
        type: ACTIONS.SET_RATIO,
        value
    }   
};

export function setAttack(value){
    return {
        type: ACTIONS.SET_ATTACK,
        value
    }   
};

export function setRelease(value){
    return {
        type: ACTIONS.SET_RELEASE,
        value
    }   
};