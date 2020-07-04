import React, {useEffect, useRef, useMemo, useCallback, useState} from "react";
import {connect} from "react-redux";
import classNames from "classnames"
import "./control-mapping.scss";
import {setMidiCurrentMapping} from "../../../../../actions";

export default function withControlMapping(Component){

    const ControlMapper = ({
           role,
           midiMapping, kbdMapping,
           currentMidiMapping,
           setMidiCurrentMapping,
           className,
           ...props})  => {
        const [isCurrent, setIsCurrent] = useState(null);

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

        if(!role) return <Component {...props} className={className}/>

        return(
            <div className={"control-mapping__wrapper " + className}>
                <Component {...props} />
                <div onClick={activate}
                     className={layerClasses} >

                </div>
            </div>
        )
    }

    const mapStateToProps = state => ({
        midiMapping : state.midi.mapping,
        kbdMapping: null,
        currentMidiMapping: state.midi.currentMapping
    })

    const mapDispatchToProps = dispatch => ({
        setMidiCurrentMapping: value => dispatch(setMidiCurrentMapping(value))
    })

    return connect(mapStateToProps, mapDispatchToProps)(ControlMapper);
}