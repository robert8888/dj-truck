import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import "./effector-channel.scss";
import DryWetKnob from "./DryWetKnob/DryWetKnob";
import EffectorButton from "./EffectorButton/EffectorButton";
import EffectorKnob from "./EffectorKnob/EffectorKnob";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { setEffectParametr } from "./../../../../../actions";
const Effector = props => {

    const [currentEffect, setCurrentEffect] = useState(null);
    const [effectorParams, setEffectorParams] = useState([]);


    const paramChangeHandle = (param, value) => {
        //console.log(currentEffect, param, value)
        props.setParameter(currentEffect, param, value);
    }

    useEffect(() => {
        let currentEffectParams = props.availableEffects[currentEffect];
        if (!currentEffectParams) {
            setEffectorParams([]);
            return;
        }
        //console.log('params', currentEffectParams)

        setEffectorParams(Object.entries(currentEffectParams).map(([name, param]) => {
            //   console.log(name, param)
            const effectState = props.channelState.effects[currentEffect];
            let value = param.defaultValue;
            if (effectState) {
                value = effectState[name] || value;
            }
            //console.log(param)

            if (param.type === "float") {
                return (<EffectorKnob key={name + param.description}
                    scale={param.max - param.min}
                    initValue={value}
                    alt={param.description}
                    showValue
                    onChange={paramChangeHandle.bind(null, name)}
                />)
            } else if (param.type === "bool") {
                console.log(name, value)
                return (<EffectorButton
                    key={name + param.description}
                    className={((value) ? "btn--pressed" : "")}
                    onChange={paramChangeHandle.bind(null, name)}
                
                >
                    {param.description}
                </EffectorButton>);
            }
        }))
    }, [currentEffect, props.effects])


    const availableEffects = Object.keys(props.availableEffects).map((effect, index) => {
        return (<Dropdown.Item key={effect + "-" + index} onClick={setCurrentEffect.bind(null, effect)}>{effect}</Dropdown.Item>)
    })


    return (
        <div className="effector-channel">
            <div className="dra-wet-knob">
                <DryWetKnob alt="D/W" />
            </div>
            <div className="effect-selector">
                <DropdownButton title={currentEffect || "-----"} className="btn-effect-select">
                    <Dropdown.Item key={"none"} onClick={setCurrentEffect.bind(null, null)}> ----- </Dropdown.Item>
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

const mapDispachToProps = (dispatch, ownProps) => ({
    setParameter: (...args) => dispatch(setEffectParametr(ownProps.channel, ...args))
})

export default connect(mapStateToProps, mapDispachToProps)(Effector);


