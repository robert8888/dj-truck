import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {connect} from "react-redux";
import PeakLevelMeter from "./PeakLevelMeter/PeakLevelMeter";
import Thumb from "./Thumb/Thumb";
import {toRange} from "utils/math/argRanges";
import _throttle from "lodash/throttle";
import {Log, Logger} from "utils/logger/logger";
import withControlMapping from "../../../Control/withControlMapping";

const VolumePeakLevelMeter = ({
      value,
      update = () => Logger.push(Log.Error("not implemented update function !!!")),
      aspect,
      doubleClickInit,
      updateFlag,
      className,
      ...props
    }) => {
    const [shift] = useState(1/(30/5)); // check peek level zero db description
    const [vertical] = useState(aspect === "vertical")
    const [areaRect, setAreaRect] = useState(null);
    const [thumbRect, setThumbRect] = useState(null);
    const [maxPosition, setMaxPosition] = useState(null);
    const [isDragged, setIsDragged] = useState(false);
    const areaRef = useRef();
    const currentValue = useRef();
    const isDraggedRef = useRef();
    const thumbRef = useRef();


    useEffect(()=>{
        const resizeObserver = new ResizeObserver( entries => {
            setThumbRect(entries[0].contentRect)
        })
        resizeObserver.observe(thumbRef.current);
        return () => resizeObserver.disconnect();
    }, [thumbRef, setThumbRect])


    const zero = useMemo(()=> {
        return vertical
            ? maxPosition * shift / (1 + shift)
            : maxPosition / (1 + shift)
    }, [maxPosition, shift, vertical])

    const throttledUpdate = useMemo(() => _throttle(update, 50), [update])


    useEffect(()=>{
        if(!areaRef.current) return;
        const resizeObserver = new ResizeObserver( entires => {

            for(let entry of entires) {
                setAreaRect(entry.target.getBoundingClientRect())
            }
        });
        resizeObserver.observe(areaRef.current, { box : 'border-box' })
        return () => {
            resizeObserver.disconnect();
        }
    }, [areaRef, setAreaRect])


    useEffect(function updateMaxPosition() {
        if(!areaRect || !thumbRect) return;
        let max = vertical ? areaRect.height : areaRect.width;
        max -= vertical ? thumbRect.height : thumbRect.width;
        setMaxPosition(max);
    }, [areaRect,thumbRect, setMaxPosition, vertical])

    const setThumbState = useCallback( state => {
        if(!thumbRef.current) return;
        requestAnimationFrame(()=>{
            if(state === "dragged"){
                thumbRef.current.classList.add("thumb--active");
                isDraggedRef.current = true;
                setIsDragged(true)
            } else {
                thumbRef.current.classList.remove("thumb--active");
                isDraggedRef.current = false;
                setIsDragged(false);
            }
        })
    }, [thumbRef, isDraggedRef, setIsDragged])

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
        if(!thumbRef.current) return;
        position = normalize(position);
        window.requestAnimationFrame(()=>{
            if(thumbRef.current)
                thumbRef.current.style.transform = `translate${vertical ? "Y" : "X"}(${position}px)`
        })
        updateValue(position);
    }, [vertical, thumbRef ,normalize, updateValue])

    const mouseMove = useCallback((shift, areaRect, event)=>{
        event.stopPropagation();
        const {clientX, clientY} = event;
        const position = (vertical ? clientY - areaRect.top : clientX - areaRect.left) - shift;
        updatePosition(position);
    }, [vertical, updatePosition])

    const pointerDown = useCallback((event) => {
        event.stopPropagation();

        const {target} = event
        const clientX = event.clientX || event.touches[0]?.clientX;
        const clientY = event.clientY || event.touches[0]?.clientY;

        if(!clientY || !clientX || !target) return;

        let shift;
        setThumbState("dragged");
        if(target.closest(".thumb") && event.pointerType === "mouse"){
            const rect = target.getBoundingClientRect();
            shift = vertical ? clientY - rect.top : clientX - rect.left;
        } else {
            const rect = target.closest(".volume-plm").getBoundingClientRect();
            shift = vertical ? thumbRect.height / 2 : thumbRect.width / 2;
            const position = ( vertical ? clientY - rect.top : clientX - rect.left ) - shift;
            updatePosition(position);
            if(event.pointerType !== "mouse"){
                return
            }
        }

        const areaRect = areaRef.current.getBoundingClientRect();
        const mMove = mouseMove.bind(null, shift, areaRect);
        const onMouseUp = (event) => {
            window.removeEventListener('mousemove', mMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mouseleave', onMouseUp);
            mMove(event);
            setThumbState(null);
        }
        window.addEventListener('mousemove', mMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mouseleave', onMouseUp);
    }, [vertical, thumbRect,  updatePosition, mouseMove, setThumbState, areaRef])

    useEffect(function setInitialPosition(){
        if(value !== undefined && value !== null) return ;
        updatePosition(positionFromValue(0))
    }, [value, updatePosition, positionFromValue])

    useEffect(function updateValueFromProps(){
        if(isDragged || value === undefined) return;
        updatePosition(positionFromValue(value / 100))
    }, [isDragged, value, currentValue, updatePosition, positionFromValue])

    return (
        <div ref={areaRef}
             onPointerDown={pointerDown}
             onDragStart={ e => e.preventDefault()}
             draggable={false}
             className={"peak-level-meter volume-plm volume-plm--" + aspect + " " + className}>
                {/*{ aspect === "horizontal"*/}
                {/*   ? <PeakLevelMeterH {...props} aspect={aspect}/>*/}
                {/*   : <PeakLevelMeterV {...props} aspect={aspect}/>*/}
                {/*}*/}
                <PeakLevelMeter {...props} aspect={aspect}/>
            <Thumb aspect={aspect}
                   ref={thumbRef}/>
        </div>
    )
}

const mapStateToProps = (state, {get}) => ({
    value : get && get(state),
})

const mapDispatchToProps = (dispatch, {set, update}) => ({
    update : (value) => (update && update(value)) || (set && dispatch(set(value)))
})

export default  withControlMapping(connect(mapStateToProps, mapDispatchToProps)(VolumePeakLevelMeter));