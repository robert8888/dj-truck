import React, {useEffect, useMemo, useCallback, useState} from "react";
import {connect} from "react-redux";
import classNames from "classnames"
import "./control-mapping.scss";
import {setCurrentMapping} from "../../../../../actions";
import ResizableText from "./utils/ResizableText";

export default function withControlMapping(Component){

    const mapStateToProps = (state) => ({
        mappingMode : state.control.mapping,
        currentMapping: state.control.currentMapping,

        midiValueMap : state.control.profiles[state.control.currentMidiProfileId]?.map.toMidi,
        kbdValueMap: state.control.profiles[state.control.currentKbdProfileId]?.map.toKbd,
        enableMapping : state.control.port || state.control.mapping ,
    })

    const mapDispatchToProps = dispatch => ({
        setCurrentMapping: value => dispatch(setCurrentMapping(value)),
        // setActionHandle: (actionId, handle) => dispatch(setMidiActionHandle(actionId, handle)),
    })


    const ControlMapper =({
           role,
           enableMapping,
           mappingMode,
           currentMapping,
           setCurrentMapping,
           currentMidiProfileId,
           midiValueMap,
           kbdValueMap,
           className,
           ...props})  => {
        const [isCurrent, setIsCurrent] = useState(null);
        const [activated, setActivated] = useState(null);
        const [aspect, setAspect] = useState("horizontal");

        const isDual = useMemo(() => mappingMode === "kbd" && role?.type === Number, [role, mappingMode])

        //if is activated then it will state activated
        useEffect(()=>{
            if(enableMapping && role){
                setActivated(true);
            }
        }, [enableMapping, role])


        const setAsCurrentMapping = useCallback((method) => {
            if(!isDual || !method){
                method = "set";
            }
            setCurrentMapping({...role, method})
        }, [setCurrentMapping, role, isDual])

        useEffect(()=>{
            if(!mappingMode || !currentMapping) return;
            (role?.id === currentMapping?.id) ?
                setIsCurrent(currentMapping?.method) :
                setIsCurrent(false)
        }, [role, mappingMode, currentMapping, setIsCurrent])

        const value = useMemo(() => {
            if(!role) return;
            if(mappingMode === "midi"){
                if(!midiValueMap || !midiValueMap[role.id]) return null;
                return {
                    set : midiValueMap[role.id]
                }

            } else if(mappingMode === "kbd"){
                const methods = {};
                ["set", "up", "down"].forEach(method => methods[method] = role.id + "-" + method)
                if(!kbdValueMap) return null;
                return {
                    set: kbdValueMap[methods.set],
                    up: kbdValueMap[methods.up],
                    down: kbdValueMap[methods.down],
                }
            }
        }, [midiValueMap, kbdValueMap,mappingMode,  role])

        const content = useMemo(()=>{
            if(!value) return {set:null, up: null, down: null}
            const content = {};
            for(let method in value){
                if(!value.hasOwnProperty(method) || !value[method]) continue;
                content[method] = <span className={"value"}>{value[method].split("-").join(" ")}</span>
            }
            return content;

        }, [value])

        const layerClasses = useMemo(()=>{
            return classNames(
                "control-mapping__layer",{
                    "control-mapping__layer--active": (mappingMode) && !!role,
                    "control-mapping__layer--splitted-horizontal":
                        (mappingMode === "kbd" && role?.type === Number && aspect === "horizontal"),
                    "control-mapping__layer--splitted-vertical":
                        (mappingMode === "kbd" && role?.type === Number && aspect === "vertical")
                }
            )
        },[mappingMode, isCurrent, role, aspect])


        const upLayerClasses = useMemo(()=>{
            return classNames({
                " control-mapping__layer--current": isCurrent === "set" || isCurrent === "up"
            })
        }, [isCurrent])

        const downLayerClasses = useMemo(()=>{
            return classNames({
                " control-mapping__layer--current": isCurrent === "down"
            })
        }, [isCurrent])

        const updateAspect = useCallback( ref =>{
            if(!ref) return;
            const rect = ref.getBoundingClientRect();
            (rect.width  > rect.height * 1.2)
                ? setAspect("horizontal")
                : setAspect("vertical")

        }, [setAspect])


        if(!activated) return <Component {...props} className={className || ""}/>

        return(
            <div ref={updateAspect} className={"control-mapping__wrapper " + (className || "")}>
                <Component {...props}/>
                <div onClick={setAsCurrentMapping.bind(null, "up")}
                     className={layerClasses + upLayerClasses}
                     data-tooltip={value && (value.set || value.up)}>
                        <ResizableText aspect={aspect}>
                            {content.set || content.up}
                        </ResizableText>
                </div>

                <div onClick={setAsCurrentMapping.bind(null, "down")}
                     className={layerClasses + downLayerClasses}
                     data-tooltip={value && value.down}>
                        <ResizableText aspect={aspect}>
                            {content.down}
                        </ResizableText>
                </div>

            </div>
        )
    }

    return connect(mapStateToProps, mapDispatchToProps)(ControlMapper);
}