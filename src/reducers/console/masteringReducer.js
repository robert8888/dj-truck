import { ACTIONS } from "./../../actions";
import { produce } from "imer";


const initState = {
    lastChange: null,

    preGain: 0,
    postGain: 0,
    threshold: 0,
    ration: 1,
    attack : .003,
    ralease : .25,
};

const nextState = (state, variable, value) => {
    return produce(state, draftState => {
        draftState.lastChange = {
            signature: "#" + variable,
            value
        }
        draftState[variable] = value;
    })
}

export default function mixerReducer(state = initState, action) {
    switch (action.type) {
        case ACTIONS.SET_PRE_GAIN: {
            return nextState(state, "preGain", action.value);
        }
        case ACTIONS.SET_POST_GAIN: {
            return nextState(state, "postGain", action.value);
        }
        case ACTIONS.SET_THRESHOLD: {
            return nextState(state, "threshold", action.value);
        }
        case ACTIONS.SET_RATIO: {
            return nextState(state, "ratio", action.value);
        }
        case ACTIONS.SET_ATTACK: {
            return nextState(state, "attack", action.value);
        }
        case ACTIONS.SET_RELEASE: {
            return nextState(state, "release", action.value);
        }

        default: return state;
    }
}