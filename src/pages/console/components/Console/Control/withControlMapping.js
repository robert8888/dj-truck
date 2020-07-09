import React, {useEffect, useRef, useMemo, useCallback, useState} from "react";
import {connect} from "react-redux";
import classNames from "classnames"
import "./control-mapping.scss";
import {setMidiCurrentMapping, setMidiActionHandle} from "../../../../../actions";

export default function withControlMapping(Component){

    const ControlMapper = ({
           role,
           midiMapping, kbdMapping,
           currentMidiMapping,
           setMidiCurrentMapping,
           currentMidiProfileId,
         //  midiProfiles,
          // currentMidiProfile,
           setActionHandle,
            midiValueMap,
           className,
           ...props})  => {
        const [isCurrent, setIsCurrent] = useState(null);
        const [containerWidth, setContainerWidth] = useState(null);

        const onChange = props.onChange;
        useEffect(()=>{
            if(!role) return;
            setActionHandle(role.id, onChange)
        }, [role, onChange, setActionHandle])

        const updateContainerWidth = useCallback((ref) => {
            setContainerWidth(ref.getBoundingClientRect().width);
        }, [setContainerWidth])

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
        }, [setMidiCurrentMapping])


        useEffect(()=>{
            if(!midiMapping) return;
            (role?.id === currentMidiMapping?.id) ?
                setIsCurrent(true) :
                setIsCurrent(false)
        }, [role, midiMapping, currentMidiMapping, setIsCurrent])

        const value = useMemo(() => {
            if(!midiValueMap || !role || !midiValueMap[role.id]) return null;
            const value = midiValueMap[role.id];
            const fontSize = Math.min(containerWidth / 5 , 20) + "px";
            return value.split("-").map( (v, i) => <span key={value + i} style={{fontSize}}>{v}</span>)
        }, [midiValueMap, role, containerWidth])


        if(!role) return <Component {...props} className={className || ""}/>

        return(
            <div ref={updateContainerWidth} className={"control-mapping__wrapper " + (className || "")}>
                <Component {...props}/>
                <div onClick={activate}
                     className={layerClasses} >
                    {value}
                </div>
            </div>
        )
    }

    const mapStateToProps = (state, ownProps) => ({
        midiMapping : state.midi.mapping,
        kbdMapping: null,
        currentMidiMapping: state.midi.currentMapping,

        midiValueMap : state.midi.profiles[state.midi.currentProfileId]?.map.toMidi
    })

    const mapDispatchToProps = dispatch => ({
        setMidiCurrentMapping: value => dispatch(setMidiCurrentMapping(value)),
        setActionHandle: (actionId, handle) => dispatch(setMidiActionHandle(actionId, handle)),
    })

    return connect(mapStateToProps, mapDispatchToProps)(ControlMapper);
}