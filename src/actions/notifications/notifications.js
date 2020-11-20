const ACTIONS = {
    NOTIFIER_PUSH: "Push new notification",
    NOTIFIER_HIDE: "Hide current notification",
}
export { ACTIONS as NOTIFIER_ACTIONS };


export function pushNotification(notification){
    return { type: ACTIONS.NOTIFIER_PUSH, notification}
}

export function hideNotification(){
    return { type: ACTIONS.NOTIFIER_HIDE }
}