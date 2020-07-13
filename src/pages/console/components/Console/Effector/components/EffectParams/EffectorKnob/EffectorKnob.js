import React from "react";
import {connect} from "react-redux";
import KnobDescribed from "./../../../../../common/KnobDescribed/KnobDescribed"
import "./effector-knob.scss";
import withControlMapping from "../../../../Control/withControlMapping";

const EffectorKnob = ({initValue, value, update, scale, text, key}) =>{
    return (
        <KnobDescribed
            className="effector-knob "
            initValue={initValue}
            value={value}
            onChange={update}
            scale={scale}
            text={text}
            showValue
            key={key}/>
    )
}

const mapStateToProps = (state, {get, defaults}) => ({
    value : get(state) ?? defaults(state),
})

const mapDispatchToProps = (dispatch, {set}) => ({
    update : value => dispatch(set(value))
})

export default withControlMapping(connect(mapStateToProps, mapDispatchToProps)(EffectorKnob));