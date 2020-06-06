import { produce } from "imer";
import { ACTIONS } from "./../../actions";
import { LOG_TYPES } from "./../../utils/logger/logger";

const initState = {
    // shape of logs:
    // logs:[{
    //     createdAt: "timestamp",
    //     type: "log/ debug / error",
    //     path: [],
    //     message: {
    //         public: "For user view, in logbox component",
    //         protected: "Only for administrator/ developer view",
    //     },
    //     error
    // }],
    //
    logs: [],
    // last: {
    //     message: "Hello this is error message",
    //     type: LOG_TYPES.ERROR,
    //     path: ['controler', 'conosle', 'deck', 'knob']
    // }
    last: null,
}

export default function loggerReducer(state = initState, action) {
    switch (action.type) {
        case ACTIONS.LOG_PUSH: {
            const { log } = action;
            if (!log) {
                return state;
            }
            log.createdAt = (new Date()).getTime();

            return produce(state, draftState => {
                const logs = state.logs;
                logs.push(log);
                draftState.logs = logs;

                if (log.message.public) {
                    draftState.last = {
                        message: log.message.public,
                        type: log.type,
                    }
                }
                if (log.path &&
                   (log.type === LOG_TYPES.DEBUG ||
                    log.type === LOG_TYPES.WARNING)) {
                    draftState.last.path = log.path;
                }
            })
        }

        case ACTIONS.LOG_CLEAR_PUBLIC_ERROR : {
            return produce(state, draftState => {
                delete draftState.last;
            })
        }

        default: return state;
    }
}