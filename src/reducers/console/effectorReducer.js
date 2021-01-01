import { ACTIONS } from "./../../actions";
import { produce } from "imer";
import {evalValue, toggleValue} from "./utils/evalMidiValue";
import _get from "lodash/get";
import _set from "lodash/set";

const channelNumber = 2;
const initState = () => {
    const channel = {
        dryWet: {
            current: 0,
            default: 0,
            min: 0,
            max: 100,
        },
        currentEffect: null,
        effects: {},
        expanded: false, // tablet and mobile only
    };

    const state = {
        lastChange: {},
        effects: {},
        channels: {},
    }

    for(let i = 1; i <= channelNumber; i++){
        state.channels[i] = channel;
    }

    return state;
}

const nextParameterState = (state, channel, effect, param, value) => {
    return produce(state, draftState => {
        const signature = "#EffectParam/" + channel + "/" + effect + "/" + param;

        _set(draftState,  ['channels', channel, 'effects', effect, param], value)

        draftState.lastChange = {signature, channel, effect, param: {[param]: value}}
    })
}

const temp = {
    floatEffectIndex: 0
}

export default function effectorReducer(state = initState(), action) {
    switch (action.type) {
        case ACTIONS.SET_AVAILABLE_EFFECTS: {
            return produce(state, nextState => nextState.effects = action.effects)
        }

        case ACTIONS.SET_EFFECT_PARAMETER: {
            let {channel, effect, name, value} = action;
            if(value === undefined) return;
            if(!effect){
                effect = state.channels[channel].currentEffect;
            }
            if(typeof name === "number" && name < Object.keys(state.effects[effect]).length){
                name = Object.keys(state.effects[effect])[name];
            }
            const min = _get(state, ["effects", effect, name, "min"]);
            const max = _get(state, ["effects", effect, name, "max"]);
            const current =
                _get(state, ["channels", channel, "effects", effect, name]) ??
                _get(state, ["effects", effect, name, "defaultValue"]);
            const type = state.effects[effect].type;
            if(type === "bool"){
                if(value === null){
                    value = !!current;
                } else if(typeof value === "string" && value.match(/^[+-]?\d+\.??\d*?%$/)){
                    value = evalValue(value, min, max , current)
                }
            } else{
                if(value === null){
                    value = toggleValue(min, max , current);
                } else if(typeof value === "string" && value.match(/^[+-]?\d+\.??\d*?%$/)) {
                    value = evalValue(value, min, max , current)
                }
            }
            return nextParameterState(state, channel, effect, name, value )
        }

        case ACTIONS.SET_CURRENT_EFFECT : {
            let {value, channel} = action;
            if(value === undefined) return state;
            if(value === "idle"){
                return produce(state, draftState =>{
                    draftState.channels[action.channel].currentEffect = 0;
                    draftState.lastChange = {
                        signature : "#EffectChange/" + channel,
                        effect : 0,
                        channel
                    }
                })
            }
            const min = 0;
            const max = Object.keys(state.effects).length - 1;
            const current = Object.keys(state.effects).indexOf(state.channels[channel].currentEffect);
            if(value === null){
                value = Object.keys(state.effects)[(current + 1) % max];
            } else if(typeof value === "string" && value.match(/^[+-]?\d+\.??\d*?%$/)){
                temp.floatEffectIndex = evalValue(value, min, max, temp.floatEffectIndex || current)
                value = Object.keys(state.effects)[Math.round(temp.floatEffectIndex)]
            }
            return produce(state, draftState =>{
                draftState.channels[action.channel].currentEffect = value;
                draftState.lastChange = {
                    signature : "#EffectChange/" + channel,
                    effect : value,
                    channel
                }
            })
        }
        
        case ACTIONS.SET_DRY_WET : {
            let {channel, value} = action;
            if(value === undefined) return state;
            const current = state.channels[channel].dryWet.current;
            const min = state.channels[channel].dryWet.min;
            const max = state.channels[channel].dryWet.max;
            if(value === null){
                value = toggleValue(min, max, current)
            }
            if(typeof value === "string"){
                value = evalValue(value, min, max, current)
            }
            return produce(state, draftState =>{
                draftState.channels[channel].dryWet.current = value;
                draftState.lastChange = {
                    signature : "#DryWetChange/" + channel,
                    channel,
                    value,
                }
            })
        }

        case ACTIONS.SET_CHANNEL_EXPANDED: {
            let {channel, value} = action;
            return produce(state, draftState =>{
                draftState.channels[channel].expanded = value;
            })
        }

        default: return state;
    }
}

