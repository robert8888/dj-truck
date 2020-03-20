const ACTIONS = {
    SET_AVAILABLE_EFFECTS : "Set all availble current effects",
    SET_EFFECT_PARAMETER : "Set to effector $channel parametr $name->$value"

}

export {ACTIONS as EFFECTOR_ACTIONS }

export function setAvailableEffects(effects){
    return {
        type: ACTIONS.SET_AVAILABLE_EFFECTS,
        effects
    }
};

export function setEffectParametr(channel, effect, name, value )
{
    return{
        type: ACTIONS.SET_EFFECT_PARAMETER,
        channel,
        effect,
        name,
        value
    }
}