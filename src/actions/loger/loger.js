const ACTIONS = {
    LOG_PUSH: "Push log",

}
export { ACTIONS as LOGGER_ACTIONS };


export function pushLog(log){
    return{ type: ACTIONS.LOG_PUSH, log}
}

