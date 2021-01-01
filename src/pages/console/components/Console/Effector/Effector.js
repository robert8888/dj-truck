import React, {useContext, useEffect, useCallback, useRef, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {MAPPING, setExpandedEffector, setDryWet} from "actions";
import DryWetKnob from "./components/DryWetKnob/DryWetKnob";
import ErrorBoundary from "pages/common/components/ErrorBoundary/ErrorBoundary";
import EffectSelector from "./components/EffectSelector/EffectSellector";
import EffectParams from "./components/EffectParams/EffectParams";
import LayoutContext from "pages/common/Layout/LayoutContext";
import classes from "classnames";
import "./effector-channel.scss";

const Effector = ({ channel}) => {
    const dispatch = useDispatch()
    const {mode, screen} = useContext(LayoutContext);
    const expanded = useSelector(state => !!state.effector.channels[channel].expanded);
    const container = useRef();

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

    const touchStart = useCallback((e) => {
        if(mode === "desktop") return;

        const rect = container.current.getBoundingClientRect();
        const shiftY = (e.clientY || e.touches[0].clientY) - rect.top;

        let top = null;
        const touchMove = (e) => {
             e.preventDefault();
             const clientY = e.clientY || e.touches[0]?.clientY || 0;
             top = clientY -shiftY;
             requestAnimationFrame(() => {
                 container.current.style.top = top + "px";
             })
        }

        window.addEventListener("touchmove", touchMove, {passive: false});
        window.addEventListener("touchend", function touchEnd(){
            window.removeEventListener("touchmove", touchMove, {passive: false});
            window.removeEventListener("touchend", touchEnd);
            localStorage.setItem(`effector-${channel}-position`, top);
        })

    }, [mode, channel, container])

    useLayoutEffect(() => {
        if(mode === "desktop") {
            container.current.style.top = null;
            return;
        }

        const top = localStorage.getItem(`effector-${channel}-position`);

        if(!top) return;

        container.current.style.top = top + "px";
    }, [mode, channel, container])

    const containerClassName = classes(
        `component`,`effector`, `ch-${channel}`,
        `effector--${mode}`,  `effector--${screen}`,
        `effector--${expanded ? "expand" : "collapsed" }`
    )

    return (
        <ErrorBoundary>
            <div className={containerClassName} ref={container}>
                <span className="component__label" onClick={toggleExpand.bind(null)} onTouchStart={touchStart}>
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


