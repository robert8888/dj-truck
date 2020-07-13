import React, {useEffect, useMemo, useCallback, useState} from "react";
import {connect} from "react-redux";
import classNames from "classnames"
import "./control-mapping.scss";
import {setMidiCurrentMapping, setMidiActionHandle} from "../../../../../actions";
import ResizableText from "./utils/ResizableText";

export default function withControlMapping(Component){

    const ControlMapper =({
           role,
           active,
           midiMapping, kbdMapping,
           currentMidiMapping,
           setMidiCurrentMapping,
           currentMidiProfileId,
           setActionHandle,
           midiValueMap,
           className,
           ...props})  => {
        const [isCurrent, setIsCurrent] = useState(null);
        const [activated, setActivated] = useState(false);

        //if is activated then it will state activated
        useEffect(()=>{
            if(active && role){
                setActivated(true);
            }
        }, [active, role])

        const layerClasses = useMemo(()=>{
            return classNames(
                "control-mapping__layer",{
                    "control-mapping__layer--active": (midiMapping || kbdMapping) && !!role,
                    "control-mapping__layer--current": isCurrent
                }
            )
        },[midiMapping, kbdMapping, isCurrent, role])

        const activate = useCallback(() => {
            setMidiCurrentMapping(role)
        }, [setMidiCurrentMapping, role])


        useEffect(()=>{
            if(!midiMapping) return;
            (role?.id === currentMidiMapping?.id) ?
                setIsCurrent(true) :
                setIsCurrent(false)
        }, [role, midiMapping, currentMidiMapping, setIsCurrent])


        const value = useMemo(() => {
            if(!midiValueMap || !role || !midiValueMap[role.id]) return null;
            return midiValueMap[role.id];
        }, [midiValueMap, role])

        const content = useMemo(()=>{
            if(!value) return  null;
            return <span className={"value"}>{value.split("-").join(" ")}</span>
        }, [value])

        console.log("mapping")
        if(!activated) return <Component {...props} className={className || ""}/>

        return(
            <div className={"control-mapping__wrapper " + (className || "")}>
                <Component {...props}/>
                <div onClick={activate}
                     className={layerClasses}
                     data-tooltip={value}>
                    <ResizableText>
                        {content}
                    </ResizableText>
                </div>
            </div>
        )
    }

    const mapStateToProps = (state) => ({
        midiMapping : state.midi.mapping,
        kbdMapping: null,
        currentMidiMapping: state.midi.currentMapping,

        midiValueMap : state.midi.profiles[state.midi.currentProfileId]?.map.toMidi,
        active : state.midi.port || state.midi.mapping ,
    })

    const mapDispatchToProps = dispatch => ({
        setMidiCurrentMapping: value => dispatch(setMidiCurrentMapping(value)),
        setActionHandle: (actionId, handle) => dispatch(setMidiActionHandle(actionId, handle)),
    })

    return connect(mapStateToProps, mapDispatchToProps)(ControlMapper);
}