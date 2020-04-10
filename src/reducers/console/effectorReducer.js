import { ACTIONS } from "./../../actions";
import { produce } from "imer";



const channelNumber = 2;
const initState = () => {
    const channel = {
        dryWet: 0,
        currentEffect: null,
        effects: {
            /*reverb: {
                decay: 5
            },
            echo: {
                time: 4
            }*/
        }
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

const nextParameterState = (state, channel, effect, param) => {
    return produce(state, nextState => {
        nextState.lastChange = {
            sygnature : "#EffectParam/" + channel + "/" + effect + "/" + Object.keys(param).join("/"),
            channel,
            effect, 
            param : param,
        }

        const effectParam = state?.channels[channel]?.effects[effect] || {};
        nextState.channels[channel].effects[effect] = { ...effectParam, ...param };
    })
}

export default function effectorReducer(state = initState(), action) {
    switch (action.type) {
        case ACTIONS.SET_AVAILABLE_EFFECTS: {
            return produce(state, nextState => nextState.effects = action.effects)
        }

        case ACTIONS.SET_EFFECT_PARAMETER: {
            return nextParameterState(state, action.channel, action.effect, { [action.name]: action.value })
        }

        case ACTIONS.SET_CURRENT_EFFECT : {
            return produce(state, nextState =>{
                nextState.channels[action.channel].currentEffect = action.effect;

                nextState.lastChange = {
                    sygnature : "#EffectChange/"+action.channel,
                    channel : action.channel,
                    effect : action.effect,
                }
            })
        }
        
        case ACTIONS.SET_DRY_WET : {
            return produce(state, nextState =>{
                nextState.channels[action.channel].dryWet= action.value;

                nextState.lastChange = {
                    sygnature : "#DryWetChange/"+action.channel,
                    channel : action.channel,
                    value : action.value,
                }
            })
        }

        default: return state;
    }
}

