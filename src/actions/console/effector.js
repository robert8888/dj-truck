const ACTIONS = {
    SET_AVAILABLE_EFFECTS : "Set all availble current effects",
    SET_EFFECT_PARAMETER : "Set to effector $channel parametr $name->$value",
    SET_DRY_WET : "Set $value of dry/wet to effector $channel",
    SET_CURRENT_EFFECT : "Set current $effect to effector $channel"
}

export {ACTIONS as EFFECTOR_ACTIONS }

export function setAvailableEffects(effects){
    return {
        type: ACTIONS.SET_AVAILABLE_EFFECTS,
        effects
    }
};

export function setEffectParameter(channel, effect, name, value )
{
    return{
        type: ACTIONS.SET_EFFECT_PARAMETER,
        channel,
        effect,
        name,
        value
    }
}

export function setCurrentEffect(channel, value){
    return {
        type: ACTIONS.SET_CURRENT_EFFECT,
        channel,
        value
    }
};


export function setDryWet(channel, value){
    return {
        type: ACTIONS.SET_DRY_WET,
        channel,
        value
    }
};
