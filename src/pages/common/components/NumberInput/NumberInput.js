import React, {useEffect, useCallback, useRef} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faChevronUp, faChevronDown} from "@fortawesome/free-solid-svg-icons";
import {Button} from "react-bootstrap";
import {toRange} from "utils/math/argRanges";
import "./number-input.scss";

const NumberInput = ({
    min = -Infinity,
    max = Infinity,
    step = 1,
    value: initValue = 0,
    onChange = () => {},
    scale = 300,
    ...rest
}) => {
    const input = useRef();
    const value = useRef();

    useEffect(() => { value.current = initValue }, [initValue]);

    const commitValue = useCallback((_value) => {
        value.current = _value;
        input.current.value = _value;
        onChange(_value)
    }, [onChange, value, input])

    const format = value => +toRange(value, min, max).toFixed(2)

    const increment = () => commitValue(format(value.current + step))

    const decrement = () => commitValue(format(value.current - step))

    const touchMove = (startY,startValue, e) => {
        e.preventDefault();
        const clientY = e.clientY || e.touches[0].clientY;
        const delta = (startY - clientY) / scale;
        const newValue =  format(startValue + delta);
        value.current = newValue;
        input.current.value = newValue;
    }

    const touchStart = (e) => {
        const startY = e.clientY || e.touches[0].clientY;
        const tMove = touchMove.bind(null, startY, value.current)
        window.addEventListener("touchmove", tMove, {passive: false})
        window.addEventListener("touchend", function touchEnd(){
            window.removeEventListener("touchmove", tMove, {passive: false})
            window.removeEventListener("touchend", touchEnd);
            console.log("on change", value.current)
            onChange(value.current)
        })
    }

    useEffect(() => {
        const _input = input.current
        if(!_input) return;
        const onInput = (e) => {
            onChange(+e.target.value)
        }
        _input.addEventListener("input", onInput)
        return () => _input.removeEventListener("input", onInput);
    }, [input, onChange])

    useEffect(() => {
        if(!input.current) return
        input.current.value = initValue
        value.current = initValue;
    }, [input, initValue, onChange])

    return (
        <div className={"number-input"} onTouchStart={touchStart}>
            <input type="number" min={min} max={max} step={step} ref={input}{...rest}/>
            <div className={"number-input__controls"}>
                <Button onClick={increment}><FontAwesomeIcon icon={faChevronUp}/></Button>
                <Button onClick={decrement}><FontAwesomeIcon icon={faChevronDown}/></Button>
            </div>
        </div>
    )
}

export default NumberInput;