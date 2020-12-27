import {ACTIONS, setExpandedEffector} from "actions";
import {takeEvery, put, select, delay} from "redux-saga/effects"


export default function* watchTurnOnEffector(){
    yield takeEvery(ACTIONS.SET_SEND, permanent)
    yield takeEvery([
        ACTIONS.SET_EFFECT_PARAMETER,
        ACTIONS.SET_CURRENT_EFFECT,
        ACTIONS.SET_DRY_WET],
        temporary
    )
}

function* permanent(action){
    const { number: channel, value} = action;
    if(!value) return;
    yield put(setExpandedEffector(channel, true))
}

const hideTime = 3000
const selectCollapse = (state, channel) => state.effector.channels[channel].expanded;

function* temporary(action){
    const { channel} = action;
    yield put(setExpandedEffector(channel, new Date().getTime() + hideTime))
    yield delay(hideTime + 100);
    const timeout = yield select(selectCollapse, channel);
    if(typeof timeout === "number" && new Date().getTime() > timeout){
        yield put(setExpandedEffector(channel, false))
    }
}