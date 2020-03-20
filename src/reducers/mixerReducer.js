import {ACTIONS} from "./../actions";
import {produce} from "imer";

const channel = {
    volume: 100,

    low: 100,
    mid : 100,
    high : 100,
    gain: 100,

    sends : [0, 0] // for two effector channels
}

const initState = {
    channels : {
        A : {
            ...channel,
        },
        B : {
            ...channel,
        },
    },
    fader : {
        position : 50 //A: 0 <-> B:100
    }
};

const nextChannelState = (state, channel, variables) => {
    return produce(state, draftSate => {
            draftSate.channels[channel] = {
                ...state.channels[channel],
                ...variables,
            }
    })
}

export default function mixerReducer(state = initState, action){
    switch(action.type){
        case ACTIONS.SET_GAIN : {
            return nextChannelState(state, action.destination, {gain: action.value})
        }
        case ACTIONS.SET_LOW : {
            return nextChannelState(state, action.destination, {low: action.value})
        }
        case ACTIONS.SET_MID : {
            return nextChannelState(state, action.destination, {mid: action.value})
        }
        case ACTIONS.SET_HI : {
            return nextChannelState(state, action.destination, {high: action.value})
        }
        case ACTIONS.SET_FADER : {
            return produce(state, draftState => draftState.fader.position = action.value);
        }
        default: return state;
    }
}