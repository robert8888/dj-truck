import {ACTIONS} from "./../../actions";
import {takeEvery, call} from "redux-saga/effects"
import {LOG_TYPES} from "./../../utils/logger/logger";

const environment = process.env.NODE_ENV; 

export default function* watchPushLog(action){
    if(environment === "development"){
        yield takeEvery(ACTIONS.LOG_PUSH, handler)
    }
}

function* handler(action){
    const {log} = action;

    if(![LOG_TYPES.DEBUG, 
         LOG_TYPES.ERROR].includes(log.type)) {
        return;
    }
    yield call(print, log)
}

function print(log){
    switch(log.type){
        case LOG_TYPES.ERROR : {
            console.group("ERROR");
            console.log(log.path);
            console.error(log.error?.message);
            console.log(log.error?.stack);
            console.log(log.message.private);
            console.log(log.message.public)
            console.groupEnd();
            break;
        }
        case LOG_TYPES.DEBUG : {
            console.group("DEBUG MSG");
            console.log(log.path);
            console.log(log.message.private);
            (log.message.public && console.log(log.message.public))
            console.groupEnd();
            break;
        }
        default: return;
    }
}