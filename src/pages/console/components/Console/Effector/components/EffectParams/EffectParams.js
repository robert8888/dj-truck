import React, {useEffect, useMemo, useRef, useState} from "react";
import {connect} from "react-redux";
import EffectorKnob from "./EffectorKnob/EffectorKnob";
import EffectorButton from "./EffectorButton/EffectorButton";
import {MAPPING, setEffectParameter} from "actions";
import _get from "lodash/get";

const EffectParams = ({allEffects, channel, effects, current}) => {
    const [currentEffect, setCurrentEffect] = useState(undefined);
    const effectsRef = useRef();

    useEffect(() => {
        effectsRef.current = effects
    }, [effects])

    useEffect(() => {
        setCurrentEffect(current);
    }, [current])

    const params = useMemo(() => {
        let currentEffectParams = allEffects[currentEffect];
        if (!currentEffectParams) {
            return null;
        }
        return (Object.entries(currentEffectParams).map(([name, param], index) => {
            const defaults = state => _get(state, ["effector", "effects", currentEffect, name, "defaultValue"])
            const get = state => _get(state, ["effector", "channels", channel, "effects", currentEffect, name])
            const set = value => setEffectParameter(channel, currentEffect, name, value)
            const role = MAPPING[`EFFECTOR_CHANNEL_${channel}_EFFECT_PARAMETER_${index + 1}`]
            if (param.type === "float") {
                return (
                    <EffectorKnob
                        key={currentEffect + name + param.description}
                        scale={param.max - param.min}
                        text={param.description}
                        defaults={defaults}
                        get={get}
                        set={set}
                        role={role}/>
                )
            } else if (param.type === "bool") {
                return (
                    <EffectorButton
                        key={currentEffect + name + param.description}
                        defaults={defaults}
                        get={get}
                        set={set}
                        role={role}>
                        {param.description}
                    </EffectorButton>
                )
            }
            return null;
        }))
    }, [currentEffect, allEffects, channel])


    return (
        <div className="effect-param">
            {params}
        </div>
    )
}

const mapStateToProps = (state, ownProps) => ({
    allEffects: state.effector.effects,
    current: state.effector.channels[ownProps.channel].currentEffect,
    effects: state.effector.channels[ownProps.channel].effects,
})

export default connect(mapStateToProps, {})(EffectParams);