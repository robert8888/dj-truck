import React, {useMemo} from "react";
import {Dropdown, DropdownButton} from "react-bootstrap";
import {setCurrentEffect} from "actions";
import {connect} from "react-redux";
import withControlMapping from "../../../Control/withControlMapping";

const EffectSelector = ({effects, current, update}) => {
    const dropItems = useMemo(() =>
        Object.keys(effects).map((effect, index) => (
                <Dropdown.Item key={effect + "-" + index}
                               onClick={update.bind(null, effect)}>
                    {effect}
                </Dropdown.Item>

        )), [effects, update])

    return (
        <div className="effect-selector__wrapper">
            <DropdownButton title={current || "-----"} className="effect-selector__button btn-effect-select">
                <Dropdown.Item key={"none"}
                               onClick={update.bind(null, "idle")}>
                    -----
                </Dropdown.Item>
                {dropItems}
            </DropdownButton>
        </div>
    )
}

const mapStateToProps = (state, {channel}) =>({
    effects : state.effector.effects,
    current: state.effector.channels[channel].currentEffect,
})

const mapDispatchToProps = (dispatch, {channel}) =>({
    update:(effect) => dispatch(setCurrentEffect(channel, effect)),
})


export default withControlMapping(connect(mapStateToProps, mapDispatchToProps)(EffectSelector));