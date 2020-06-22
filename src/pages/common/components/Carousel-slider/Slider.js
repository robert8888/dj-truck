import React, {useCallback, useEffect, useRef, useState} from "react";
import UUID from "uuidjs";
import style from "./slider.scss"

const rmLast = (arr, direction) => {
    direction = direction > 1 ? "next" : "prev";
    let last = arr.length - 1;
    let _arr = [...arr];
    while (last >= 0) {
        if (direction === "next" && arr[last] < 0) break;
        if (direction === "prev" && arr[last] > 0) break;
        _arr.pop();
        last--;
    }
    return _arr;
}

const sumLastSameDirection = (arr, {max}) => {
    let _arr = [...arr];
    if (arr.length > 1 && arr[arr.length - 1] * arr[arr.length - 2] > 0) {
        let last = _arr.pop();
        let prev = _arr.pop();
        let sum = last + prev;
        if(max && Math.abs(sum) > max){
            sum = (sum > 0) ? max : -max;
        }
        _arr.push(sum);
    }
    return _arr;
}

const Slider = ({
    slides: initSlides,
    next: nextHandle,
    prev: prevHandle,
    minSlideWidth = style.minSlideWidth,
    onStepDragging = false
}) => {
    const slider = useRef();
    const [active, setActive] = useState(false);
    const [overLapRatio] = useState(2);
    const [animationDuration] = useState(parseInt(style.animatioDuration) * 1000);

    const [_containerRect, setContainerRect] = useState(null);
    const [slideWidth, setSlideWidth] = useState(null);
    const [visibleSlides, setVisibleSlides] = useState(null);
    const [slides, setSlides] =  useState(null);

    const shift = useRef();
    const balancedShift = useRef();
    const translate = useRef();
    const inAction = useRef();
    const actionQueue = useRef();

    const containerRect = useCallback(() => {
        if (!slider.current) return 0;
        let rect = _containerRect
        if (!rect) {
            rect = slider.current.parentElement.getBoundingClientRect()
            setContainerRect(rect);
        }
        return rect;
    }, [_containerRect, setContainerRect])

    const updateTransition = useCallback(value => {
        if (!slider.current) return;
        value ?
            slider.current.classList.add('slider-transition--active')
            :
            slider.current.classList.remove('slider-transition--active')

    }, [slider])

    const updateTranslate = useCallback(target => {
        if (!slider.current) return;
        slider.current.style.transform = `translateX(${target}px)`
        translate.current = target;
    }, [slider, translate])

    const updatePosition = useCallback((position, sWidth)=> {
        if (!slider.current || isNaN(position) || !active ) return;
        updateTranslate(position * (slideWidth || sWidth));
    }, [slider, slideWidth, updateTranslate, active])

    useEffect(()=>{
        if(!visibleSlides || visibleSlides > initSlides.length) return;
        setActive(true);

        let slides = [].concat(Array(overLapRatio *  2 + 1).fill(1).map( () => initSlides)).flat();
        setSlides(slides);
    }, [visibleSlides, setActive, initSlides, setSlides, overLapRatio])


    useEffect(()=>{
        if (!containerRect || !minSlideWidth || !slider.current) return;
        const containerWidth = containerRect().width;
        const visibleSlides = ~~(containerWidth / parseInt(minSlideWidth));
        setVisibleSlides(visibleSlides);
    }, [containerRect, minSlideWidth, slider, setVisibleSlides])

    useEffect(() => {
        if(!slides) return;
        shift.current = -initSlides.length * overLapRatio;
        balancedShift.current = shift.current;
        updatePosition(shift.current);
    }, [slideWidth, updatePosition, shift, balancedShift, initSlides, slides, overLapRatio])

    useEffect(() => {
        const resetSize = () => setContainerRect(null);
        window.addEventListener("resize", resetSize);
        return () => window.removeEventListener("resize", resetSize);
    }, [setContainerRect])

    useEffect(() => {
        if(!visibleSlides || !containerRect || !slides) return;
        const slideWidth = containerRect().width / visibleSlides
        setSlideWidth(slideWidth);
        slider.current.style.width = slideWidth * slides.length + "px";
    }, [containerRect,  visibleSlides, slides]);

    const appendSlides = useCallback(amount => {
        setSlides(slides => {
            const _slides = [...slides];
            for (let i = 0; i < amount; i++) {
                const slide = _slides.shift();
                _slides.push(slide)
            }
            return _slides;
        })
    }, [setSlides])

    const prependSlides = useCallback(amount => {
        setSlides(slides => {
            const _slides = [...slides];
            for (let i = 0; i < amount; i++) {
                const slide = _slides.pop();
                _slides.unshift(slide)
            }
            return _slides;
        })
    }, [setSlides])

    const actionRef = useRef();
    const balance = useCallback(() => {
        const diff = balancedShift.current - shift.current;
        if(!diff) {
            return;
        }
        (diff < 0) ? prependSlides(Math.abs(diff)) : appendSlides(diff);
        updateTransition(false);
        shift.current = balancedShift.current;
        updatePosition(shift.current);
        setTimeout(()=>{
            actionRef.current && actionRef.current();
        }, 0)
    }, [shift, balancedShift, prependSlides, appendSlides, updateTransition, updatePosition, actionRef])


    const action = useCallback((direction) => {
        if (inAction.current) {
            if(!direction) return;
            let queue  = actionQueue.current || [];
            queue = rmLast([...queue], direction);
            queue = sumLastSameDirection([...queue, direction], {max : 3})
            actionQueue.current = queue;
            return;
        }
        direction = direction || (actionQueue.current && actionQueue.current.shift());
        if(!direction) return;

        inAction.current = true;
        updateTransition(true);
        shift.current += direction;
        updatePosition(shift.current, slideWidth );
        setTimeout(()=>{
            inAction.current = false;
            balance();
        }, animationDuration)
    }, [balance, animationDuration, updatePosition, inAction, updateTransition, shift, slideWidth])

    useEffect(()=>{
        actionRef.current = (...arg) => action(...arg);
    }, [action, actionRef])

    const next = useCallback(() => {
        action(1);
    }, [action])

    useEffect(() => nextHandle && nextHandle(next), [next, nextHandle])

    const prev = useCallback(() => {
        action(-1);
    }, [action])

    useEffect(() => prevHandle && prevHandle(prev), [prev, prevHandle])

    const endDraging = useCallback(() => {
        let next = Math.round(translate.current / slideWidth);
        if(onStepDragging){
            next = next >  shift.current  ? shift.current + 1 : shift.current - 1;
        }
        shift.current = next;
        updatePosition(shift.current);
        inAction.current = true;
        setTimeout(()=> {
            balance();
            inAction.current = false;
        }, animationDuration);
    }, [translate, inAction, shift, slideWidth, balance,  animationDuration,  onStepDragging, updatePosition])

    const mouseMove = useCallback((shiftX, event) => {
        const clientX = (event.type === "touchmove") ? event.touches[0].clientX : event.clientX;
        updateTranslate(clientX - shiftX);
    }, [updateTranslate])


    const mouseDown = useCallback(event => {
        const sliderContainer = event.target.closest(".carousel-slider-container");
        if(!sliderContainer) return;
        actionQueue.current = [];
        const rect = sliderContainer.getBoundingClientRect();
        const clientX = (event.type === "touchstart") ? event.touches[0].clientX : event.clientX;
        const shiftX = clientX - rect.left - shift.current * slideWidth;
        const mouseMoveWithArgs = mouseMove.bind(null, shiftX);

        const mouseUp = () => {
            window.removeEventListener("mousemove", mouseMoveWithArgs);
            window.removeEventListener("mouseup", mouseUp);
            window.removeEventListener("touchmove", mouseMoveWithArgs);
            window.removeEventListener("touchend", mouseUp)
            updateTransition(true);
            endDraging();
        }

        window.addEventListener("mousemove", mouseMoveWithArgs);
        window.addEventListener("touchmove", mouseMoveWithArgs);
        window.addEventListener("mouseup", mouseUp);
        window.addEventListener("touchend", mouseUp);
        updateTransition(false);
    }, [updateTransition, shift, slideWidth, endDraging, mouseMove, actionQueue])

    return (
        <div className="carousel-slider-container">
           <ul className="carousel-slider" ref={slider} onMouseDown={mouseDown} onTouchStart={mouseDown} onDrag={ e => e.preventDefault()}>
                {slides && slides instanceof Array && slides.map(slide => (
                    <li key={UUID.genV1()} className={"slide"} style={{width: minSlideWidth || "initial"}}>{slide}</li>
                ))}
            </ul>
        </div>
    )
}
export default Slider;