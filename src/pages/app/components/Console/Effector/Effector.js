import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { throttle } from "./../../../../../utils/functions/lodash";

import "./effector-channel.scss";
import DryWetKnob from "./DryWetKnob/DryWetKnob";
import EffectorButton from "./EffectorButton/EffectorButton";
import EffectorKnob from "./EffectorKnob/EffectorKnob";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { setEffectParametr, setCurrentEffect, setDryWet } from "./../../../../../actions";
import mapComponentToParameter from "./utils/mapComponentToParameter";
const Effector = props => {

    const [currentEffect, setCurrentEffect] = useState(undefined);
    const [effectorParams, setEffectorParams] = useState([]);


    /*const paramChangeHandle = (param, value) => {
        props.setParameter(currentEffect, param, value);
    }
*/

    const setParameterHandle = props.setParameter;
    const paramChangeHandle = useCallback((param, value)=>{
        setParameterHandle(currentEffect, param, value);
    }, [setParameterHandle, currentEffect])

    const setCurrentEffectHandle = props.setCurrentEffect;
    useEffect(() => {
        setCurrentEffectHandle(currentEffect);
    }, [currentEffect, setCurrentEffectHandle])


    useEffect(() => {
        let currentEffectParams = props.availableEffects[currentEffect];
        if (!currentEffectParams) {
            setEffectorParams([]);
            return;
        }

        setEffectorParams(Object.entries(currentEffectParams).map(([name, param]) => {
            //console.log("producing knobs")
            const effectState = props.channelState.effects[currentEffect];

            let value = param.defaultValue;
            if (effectState) {
                value = effectState[name] || value;
            }

            let bindData = {
                channel: props.channel,
                effect: currentEffect,
                name: name
            };

            let reactElement = "";
            if (param.type === "float") {
                let Knob = mapComponentToParameter(bindData, EffectorKnob);
                reactElement = (
                    <Knob
                        key={name + param.description}
                        scale={param.max - param.min}
                        initValue={value}
                        alt={param.description}
                        showValue
                        onChange={paramChangeHandle.bind(null, name)} />
                )
            } else if (param.type === "bool") {
                const Button = mapComponentToParameter(bindData, EffectorButton);

                reactElement = (<Button
                    key={currentEffect + name + param.description}
                    onChange={paramChangeHandle.bind(null, name)}>
                    {param.description}
                </Button>)
            }

            return reactElement
        }))
    }, [ currentEffect])


    const availableEffects = Object.keys(props.availableEffects).map((effect, index) => {
        return (<Dropdown.Item key={effect + "-" + index} onClick={setCurrentEffect.bind(null, effect)}>{effect}</Dropdown.Item>)
    })


    return (
        <div className={"effector-channel effector ch-" + props.channel}>
            <span className="label">{"FX " + props.channel}</span>
            <div className="dra-wet-knob">
                <DryWetKnob alt="D/W" onChange={props.setDryWet} />
            </div>
            <div className="effect-selector">
                <DropdownButton title={currentEffect || "-----"} className="btn-effect-select">
                    <Dropdown.Item key={"none"} onClick={setCurrentEffect.bind(null, undefined)}> ----- </Dropdown.Item>
                    {availableEffects}
                </DropdownButton>
            </div>
            <div className="effector-param">
                {effectorParams}
            </div>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => ({
    availableEffects: state.effector.effects,
    channelState: state.effector.channels[ownProps.channel]
})

const mapDispachToProps = (dispatch, ownProps) => {
    const tdispatch = throttle(dispatch, 100);
    return {
    setParameter: (...args) => tdispatch(setEffectParametr(ownProps.channel, ...args)),
    setCurrentEffect: (effect) => dispatch(setCurrentEffect(ownProps.channel, effect)),
    setDryWet: (value) => dispatch(setDryWet(ownProps.channel, value))
}}

export default connect(mapStateToProps, mapDispachToProps)(Effector);


