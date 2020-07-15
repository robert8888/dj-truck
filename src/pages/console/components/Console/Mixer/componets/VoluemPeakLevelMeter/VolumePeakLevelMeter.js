import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import PeakLevelMeterH from "./PeakLevelMeter/PeakLevelMeterH";
import PeakLevelMeterV from "./PeakLevelMeter/PeakLevelMeterV";
import Thumb from "./Thumb/Thumb";
import {toRange} from "../../../../../../../utils/math/argRanges";
import _throttle from "lodash/throttle";
import {Log, Logger} from "../../../../../../../utils/logger/logger";
import {connect} from "react-redux";

const VolumePeakLevelMeter = ({
      value,
      update = () => Logger.push(Log.Error("not implemented update function !!!")),
      aspect,
      doubleClickInit,
      ...props
    }) => {
    const [shift] = useState(1/(30/5)); // check peek level zero db description
    const [vertical, setVertical] = useState(aspect === "vertical")
    const [areaRect, setAreaRect] = useState(null);
    const [thumbRect, setThumbRect] = useState(null);
    const [maxPosition, setMaxPosition] = useState(null);
    const [isDragged, setIsDragged] = useState(false);
    const currentValue = useRef();
    const isDraggedRef = useRef();
    const thumb = useRef();

    const updateAreaRect = useCallback(ref => (
        ref && !areaRect && setAreaRect(ref.getBoundingClientRect())
    ), [setAreaRect, areaRect])

    const thumbRef = useCallback( ref => {
        if(!ref) return ;
        thumb.current = ref;
        setThumbRect(ref.getBoundingClientRect());
    }, [thumb])

    const zero = useMemo(()=> {
        return vertical
            ? maxPosition * shift / (1 + shift)
            : maxPosition / (1 + shift)
    }, [maxPosition, shift, vertical])

    const throttledUpdate = useMemo(() => _throttle(update, 50), [update])

    useEffect(function onAspectChange(){
        setVertical(aspect === "vertical")
        thumb.current && setThumbRect(thumb.current.getBoundingClientRect());
    }, [aspect, thumb, setThumbRect])

    useEffect(function updateAreaRectOnResize(){
        const resetSize = () => setAreaRect(null);
        window.addEventListener("resize", resetSize);
        return () => {
            window.removeEventListener("resize", resetSize);
        }
    }, [setAreaRect])

    useEffect(function updateMaxPosition() {
        if(!areaRect || !thumbRect) return;
        let max = vertical ? areaRect.height : areaRect.width;
        max -= vertical ? thumbRect.height : thumbRect.width;
        setMaxPosition(max);
    }, [areaRect,thumbRect, setMaxPosition, vertical])

    const setThumbState = useCallback( state => {
        if(!thumb.current) return;
        if(state === "dragged"){
            thumb.current.classList.add("thumb--active");
            isDraggedRef.current = true;
            setIsDragged(true)
        } else {
            thumb.current.classList.remove("thumb--active");
            isDraggedRef.current = false;
            setIsDragged(false);
        }
    }, [thumb, isDraggedRef, setIsDragged])

    const valueFromPosition = useCallback(position => {
        return vertical
            ? -((position - zero) / (maxPosition - zero))
            :  (position - zero) / zero
    }, [vertical, maxPosition, zero])

    const positionFromValue = useCallback((value)=>{
        return vertical
            ? -((maxPosition - zero ) * (value - shift))
            :  (maxPosition  * value) + zero
    },[vertical, maxPosition,shift, zero])

    const updateValue = useCallback((position)=>{
        if(!isDraggedRef.current) return;
        const value = valueFromPosition(position);
        currentValue.current = value;
        throttledUpdate(value * 100);
    }, [isDraggedRef, throttledUpdate, valueFromPosition, currentValue])

    const normalize = useCallback(position => {
        return toRange(position, 0 , maxPosition)
    }, [maxPosition])

    const updatePosition = useCallback((position)=>{
        if(!thumb.current) return;
        position = normalize(position);
        window.requestAnimationFrame(()=>{
            thumb.current.style.transform = `translate${vertical ? "Y" : "X"}(${position}px)`
        })
        updateValue(position);
    }, [vertical, thumb ,normalize, updateValue])

    const mouseMove = useCallback((shift, {clientX, clientY})=>{
        const position = (vertical ? clientY - areaRect.top : clientX - areaRect.left) - shift;
        updatePosition(position);
    }, [vertical, areaRect, updatePosition])

    const mouseDown = useCallback(({target, clientX, clientY}) => {
        let shift;
        setThumbState("dragged");
        if(target.matches(".thumb")){
            const rect = target.getBoundingClientRect();
            shift = vertical ? clientY - rect.top : clientX - rect.left;
        } else {
            const rect = target.closest(".volume-plm").getBoundingClientRect();
            shift = vertical ? thumbRect.height / 2 : thumbRect.width / 2;
            const position = ( vertical ? clientY - rect.top : clientX - rect.left ) - shift;
            updatePosition(position);
        }
        const mMove = mouseMove.bind(null, shift);
        const onMouseUp = () => {
            window.removeEventListener('mousemove', mMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mouseleave', onMouseUp);
            setThumbState(null);
        }
        window.addEventListener('mousemove', mMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mouseleave', onMouseUp);
    }, [vertical, thumbRect, updatePosition, mouseMove, setThumbState])

    const mouseDoubleClick = useCallback(()=>{
        if(!doubleClickInit) return;
        isDraggedRef.current = true;
        updatePosition(positionFromValue(0))
        isDraggedRef.current = false;
    }, [isDraggedRef, updatePosition, positionFromValue, doubleClickInit])

    useEffect(function setInitialPosition(){
        if(value !== undefined && value !== null) return ;
        updatePosition(positionFromValue(0))
    }, [value, updatePosition, positionFromValue])

    useEffect(function updateValueFromProps(){
        if(isDragged || value === undefined) return;
        updatePosition(positionFromValue(value / 100))
    }, [isDragged, value, currentValue, updatePosition, positionFromValue])

    return (
        <div ref={updateAreaRect}
             onMouseDown={mouseDown}
             onDoubleClick={mouseDoubleClick}
             onDragStart={ e => e.preventDefault()}
             className={"peak-level-meter volume-plm volume-plm--" + aspect}>
                { aspect === "horizontal"
                   ? <PeakLevelMeterH {...props}/>
                   : <PeakLevelMeterV {...props}/>
                }
            <Thumb aspect={aspect}
                   ref={thumbRef}
                   onMouseDown={mouseDown}/>
        </div>
    )
}

const mapStateToProps = (state, {get}) => ({
    value : get && get(state),
})

const mapDispatchToProps = (dispatch, {set, update}) => ({
    update : (value) => (update && update(value)) || (set && dispatch(set(value)))
})

export default connect(mapStateToProps, mapDispatchToProps)(VolumePeakLevelMeter);