import { produce } from "imer";
import { ACTIONS } from "./../../actions";
import _set from "lodash/set";
import _get from "lodash/get";

const channel = {
    volume: {
      min: -100,
      max: 30,
      default: 0,
      current: 0,
    },

    low: {
        min: -50,
        default: 0,
        current: 0,
        max: 10,
    },
    mid: {
        min: -50,
        default: 0,
        current: 0,
        max: 10,
    },
    high: {
        min: -50,
        default: 0,
        current: 0,
        max: 10,
    },
    gain: {
        min: -100,
        default: 0,
        current: 0,
        max: 25,
    },
    filter: {
        min: -10,
        default: 0,
        current: 0,
        max: 10,
    },
    filterResonance: {
        min: 0,
        default: 5,
        current: 0,
        max: 20,
    },
    cue: {
        min: 0,
        max: 1,
        default: 1,
        current: 0,
    },
    sends: [0, 0]
}

const initState = {
    cueEnabled: false, // depends on how many audio channels are available
    channels: {
        A: {
            ...channel,
        },
        B: {
            ...channel,
        },
    },
    fader: {
        min: -50,
        max: 50,
        default: 0,
        current: 0 //A: -50 <-> B:50
    }
};


const evalValue = (state,  name, value, channel) => {
    const base = channel ? ["channels", channel] : [];

    const min = _get(state, [...base, name, "min"]);
    const max = _get(state, [...base,  name, "max"]);
    const current = _get(state, [...base, name, "current"]);

    if((min === null || min === undefined) ||
        (max === null || max === undefined)){

        return typeof current === "boolean" ? !!parseInt(value) : parseFloat(value);
    }

    if(value.startsWith("+") || value.startsWith("-")){
        const about = parseFloat(value.substr(1)) /100
        const diff = (max - min) * about;
        if(value.startsWith("+")){
            return Math.min(current + diff, max);
        }
        return Math.max(current - diff, min);
    }

    value = parseFloat(value) / 100;
    let range = max - min;
    return value * range + min;
}

const getValue = (state, variable, channel) => {
    const base = channel ? ["channels", channel] : [];

    const current = _get(state, [...base, variable, "current"])
    if(typeof current === "boolean"){
        return !current;
    }
    const min = _get(state, [...base, variable, "min"])
    const default_ = _get(state, [...base, variable, "default"]);

    if(Math.abs(default_ - current) < Math.abs(default_ - min)){
        return min;
    }
    return default_;
}


const nextChannelState = (state, channel, variables) => {
    return produce(state, draftState => {
        for(let key in variables){
            if(!variables.hasOwnProperty(key)) continue;
            let value = variables[key];
            if(value === undefined) continue;
            if(value === null){
                value = getValue(state, key, channel)
            }
            if(typeof value === "string" && value.endsWith("%")){
                value = evalValue(state,  key, value, channel)
            }
            _set(draftState, ["channels", channel, key, "current"], value);
        }
    })
}



export default function mixerReducer(state = initState, action) {
    switch (action.type) {
        case ACTIONS.SET_FADER: {
            let {value} = action;
            if(value === undefined) return state;
            if(value === null){
                getValue(state, "fader");
            }
            if(typeof value === "string"){
                value = evalValue(state, "fader", value);
            }
            return produce(state, draftState => draftState.fader.current = value);
        }
        case ACTIONS.SET_GAIN: {
            return nextChannelState(state, action.destination, { gain: action.value })
        }
        case ACTIONS.SET_VOLUME:{
            return nextChannelState(state, action.destination, { volume: action.value })
        }

        case ACTIONS.SET_LOW: {
            return nextChannelState(state, action.destination, { low: action.value })
        }
        case ACTIONS.SET_MID: {
            return nextChannelState(state, action.destination, { mid: action.value })
        }
        case ACTIONS.SET_HI: {
            return nextChannelState(state, action.destination, { high: action.value })
        }

        case ACTIONS.SET_FILTER: {
            return nextChannelState(state, action.destination, { filter: action.value })
        }

        case ACTIONS.SET_FILTER_RES: {
            return nextChannelState(state, action.destination, { filterResonance: action.value })
        }

        case ACTIONS.SET_SEND: {
            let {value, number, destination} = action;
            number--;

            if(value === undefined) return state;

            if(value === null){
                const current = _get(state, ["channels", destination, "sends", number])
                value =  current ? 0 : 1;
            }

            if(typeof value === "string"){
                value = Math.round(parseInt(value) / 100);
            }

            return produce(state, draftSate =>
                draftSate.channels[destination].sends[number] = value
            )
        }

        case ACTIONS.SET_CUE_ENABLED : {
            return produce(state, draftSate =>
                    draftSate.cueEnabled = action.value
                )
        }

        case ACTIONS.SET_CUE : {
            if(!state.cueEnabled) return state;

            let {value} = action;
            if(typeof value === "boolean") value = parseFloat(value);
            return nextChannelState(state, action.destination, { cue: value })
        }

        default: return state;
    }
}