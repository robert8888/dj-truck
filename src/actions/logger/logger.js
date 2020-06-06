const ACTIONS = {
    LOG_PUSH: "Push log",
    LOG_CLEAR_PUBLIC_ERROR : "Remove log from last public" 
}
export { ACTIONS as LOGGER_ACTIONS };


export function pushLog(log){
    return{ type: ACTIONS.LOG_PUSH, log}
}

export function clearPublicError(){
    return {type : ACTIONS.LOG_CLEAR_PUBLIC_ERROR}
}

