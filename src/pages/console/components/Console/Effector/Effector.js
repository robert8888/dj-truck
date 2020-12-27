import React, {useContext, useEffect, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {MAPPING, setExpandedEffector, setDryWet} from "actions";
import DryWetKnob from "./components/DryWetKnob/DryWetKnob";
import ErrorBoundary from "pages/common/components/ErrorBoundary/ErrorBoundary";
import EffectSelector from "./components/EffectSelector/EffectSellector";
import EffectParams from "./components/EffectParams/EffectParams";
import "./effector-channel.scss";
import LayoutContext from "pages/common/Layout/LayoutContext";

const Effector = ({ channel}) => {
    const dispatch = useDispatch()
    const {mode, screen} = useContext(LayoutContext);
    const expanded = useSelector(state => !!state.effector.channels[channel].expanded);

    const setExpanded = useCallback(value =>
        dispatch(setExpandedEffector(channel, value))
    ,[channel, dispatch])

    const toggleExpand = useCallback(() => {
        dispatch(setExpandedEffector(channel, !expanded))
    }, [expanded, dispatch, channel])


    useEffect(() => {
        if(!expanded || mode === "desktop")
            return;

        const pointer = e => {
            if(e.target.closest(".component.effector"))
                return;
            setExpanded(false)
            window.removeEventListener("touchstart", pointer, {passive: false});
            window.removeEventListener("click", pointer);
        }

        window.addEventListener("touchstart", pointer, {passive: false});
        window.addEventListener("click", pointer);

    }, [expanded, setExpanded, mode])

    useEffect(() => () => setExpanded(false), [setExpanded])


    return (
        <ErrorBoundary>
            <div className={`component effector ch-${channel}
            effector--${mode} effector--${screen} effector--${expanded ? "expand" : "collapsed" }`}>
                <span className="component__label" onClick={toggleExpand.bind(null)}>
                    {"FX " + channel}
                </span>
                <div className={`effector__group ch-${channel} `}>
                <DryWetKnob get={ state => state.effector.channels[channel].dryWet.current}
                            set={ value => setDryWet(channel, value)}
                            role={MAPPING[`EFFECTOR_CHANNEL_${channel}_DW`]}/>
                <EffectSelector className={"effect-selector"}
                                channel={channel}
                                role={MAPPING[`EFFECTOR_CHANNEL_${channel}_EFFECT`]}/>
                </div>
                <EffectParams channel={channel}/>
            </div>
        </ErrorBoundary>
    )
}

export default Effector;


