import { ACTIONS } from "actions";

const initState = {
    current: null,
    notifications: [],
}

export default function (state = initState, action){
    switch (action.type){
        case ACTIONS.NOTIFIER_PUSH: {
            return {
                ...state,
                notifications: [...state.notifications, action.notification],
                current: action.notification,
            };
        }

        case ACTIONS.NOTIFIER_HIDE: {
            const next = {
                ...state,
            }
            delete next.current;
            return next;
        }

        default: return state;
    }
}