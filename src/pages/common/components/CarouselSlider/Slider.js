import React, {useCallback, useEffect, useRef, useState} from "react";
import UUID from "uuidjs";
import style from "./slider.scss"
import UUDI from "uuidjs";

const rmLast = (arr, direction) => {
    direction = direction < 0 ? "next" : "prev";
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
        if (max && Math.abs(sum) > max) {
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
                    set: setHandle,
                    getLength: getLengthHandle,
                    onChange,
                    minSlideWidth = style.minSlideWidth,
                    oneStepDragging = false,
                    auto = null,
                }) => {
    const slider = useRef();
    const [active, setActive] = useState(false);
    const [overLapRatio] = useState(2);
    const [animationDuration] = useState(parseInt(style.animatioDuration) * 1000);

    const [_containerRect, setContainerRect] = useState(null);
    const [slideWidth, setSlideWidth] = useState(null);
    const [visibleSlides, setVisibleSlides] = useState(null);
    const [slides, setSlides] = useState(null);

    const shift = useRef();
    const balancedShift = useRef();
    const translate = useRef();
    const inAction = useRef();
    const actionQueue = useRef();
    const currentSlide = useRef();
    const isDragged = useRef();
    const isMounted = useRef();

    useEffect(() => {
        isMounted.current = true;
        return () => isMounted.current = false;
    },[isMounted])

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

    const updatePosition = useCallback((position, sWidth) => {
        if (!slider.current || isNaN(position) || !active) return;
        updateTranslate(position * (slideWidth || sWidth));
    }, [slider, slideWidth, updateTranslate, active])

    const updateCurrentSlide = useCallback((direction = 0) => {
        let current = currentSlide.current ?? Math.floor(visibleSlides / 2);
        current = (current - direction) % initSlides.length;
        if (current < 0) {
            current = initSlides.length + current;
        }
        currentSlide.current = current;
        onChange && onChange(current);
    }, [currentSlide, initSlides, onChange, visibleSlides])

    useEffect(() => {
        if (!visibleSlides) return;
        setTimeout(() => updateCurrentSlide(), 0);
    }, [visibleSlides, updateCurrentSlide])

    useEffect(() => {
        if (!visibleSlides || visibleSlides > initSlides.length) {
            setSlides(initSlides);
            return;
        }
        setActive(true);

        const slides = Array((initSlides.length + 1) *  overLapRatio * 2 ).fill(1).map((_, index) =>{
            const slide = initSlides[index % initSlides.length];
            return React.cloneElement(
                slide,
                {
                    id : UUID.genV4().toString(),
                }
            )
        })
        setSlides(slides);
    }, [visibleSlides, setActive, initSlides, setSlides, overLapRatio])


    useEffect(() => {
        if (!containerRect || !minSlideWidth || !slider.current) return;
        const containerWidth = containerRect().width;
        const visibleSlides = ~~(containerWidth / parseInt(minSlideWidth));
        setVisibleSlides(visibleSlides);

    }, [containerRect, minSlideWidth, slider, setVisibleSlides])

    useEffect(() => {
        if (!slides) return;
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
        if (!visibleSlides || !containerRect || !slides) return;
        const slideWidth = containerRect().width / visibleSlides
        setSlideWidth(slideWidth);
        let width = slideWidth * slides.length;
        if (visibleSlides > slides.length) {
            width = containerRect().width;
        }
        slider.current.style.width = width + "px";
    }, [containerRect, visibleSlides, slides]);


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
        if(!isMounted.current) return;

        const diff = balancedShift.current - shift.current;
        if (!diff) {
            return;
        }
        (diff < 0) ? prependSlides(Math.abs(diff)) : appendSlides(diff);
        updateTransition(false);
        shift.current = balancedShift.current;
        updatePosition(shift.current);
        setTimeout(() => {
            actionRef.current && actionRef.current();
        }, 0)
    }, [shift, balancedShift, prependSlides, appendSlides,
        updateTransition, updatePosition, actionRef, isMounted])


    const action = useCallback((direction) => {
        if (inAction.current) {
            if (!direction) return;
            let queue = actionQueue.current || [];
            queue = rmLast([...queue], direction);
            queue = sumLastSameDirection([...queue, direction], {max: 3})
            actionQueue.current = queue;
            return;
        }
        direction = direction || (actionQueue.current && actionQueue.current.shift());
        if (!direction) return;

        inAction.current = true;
        updateTransition(true);
        shift.current += direction;
        updatePosition(shift.current, slideWidth);
        setTimeout(() => {
            inAction.current = false;
            !isDragged.current && balance();
        }, animationDuration);
        updateCurrentSlide(direction);
    }, [balance, animationDuration, updatePosition, inAction, isDragged,
             updateTransition, shift, slideWidth, updateCurrentSlide])

    useEffect(() => {
        actionRef.current = (...arg) => action(...arg);
    }, [action, actionRef])

    const next = useCallback(() => {
        if (!active) return;
        action(-1);
    }, [action, active])

    useEffect(() => nextHandle && nextHandle(next), [next, nextHandle])

    const prev = useCallback(() => {
        if (!active) return;
        action(1);
    }, [action, active])

    useEffect(() => prevHandle && prevHandle(prev), [prev, prevHandle]);

    const set = useCallback((target) => {
        if (!active) return;
        action(currentSlide.current - target);
    }, [currentSlide, active, action])

    useEffect(() => setHandle && setHandle(set), [setHandle, set])

    const getLength = useCallback(() => {
        return initSlides.length;
    }, [initSlides])

    useEffect(() => getLengthHandle && getLengthHandle(getLength), [getLength, getLengthHandle])

    const endDragging = useCallback(() => {
        let next = Math.round(translate.current / slideWidth);
        if (oneStepDragging) {
            next = next > shift.current ? shift.current + 1 : shift.current - 1;
        }
        updateCurrentSlide(next - shift.current);
        shift.current = next;
        updatePosition(shift.current);
        inAction.current = true;
        setTimeout(() => {
            !isDragged.current && balance();
            inAction.current = false;
        }, animationDuration);
        isDragged.current = false;
    }, [translate, inAction, shift, slideWidth, balance,
        animationDuration, oneStepDragging, updatePosition, updateCurrentSlide])

    const mouseMove = useCallback((shiftX, event) => {
        const clientX = (event.type === "touchmove") ? event.touches[0].clientX : event.clientX;
        updateTranslate(clientX - shiftX);
    }, [updateTranslate])

    const mouseDown = useCallback(event => {
        const sliderContainer = event.target.closest(".carousel-slider-container");
        if (!sliderContainer || !active) return;
        actionQueue.current = [];
        const clientX = (event.type === "touchstart") ? event.touches[0].clientX : event.clientX;
        const shiftX = clientX - (shift.current * slideWidth);
        const mouseMoveWithArgs = mouseMove.bind(null, shiftX);

        const mouseUp = () => {
            window.removeEventListener("mousemove", mouseMoveWithArgs);
            window.removeEventListener("mouseup", mouseUp);
            window.removeEventListener("touchmove", mouseMoveWithArgs);
            window.removeEventListener("touchend", mouseUp)
            window.removeEventListener("mouseleave", mouseUp);
            updateTransition(true);
            endDragging();
        }

        window.addEventListener("mousemove", mouseMoveWithArgs);
        window.addEventListener("touchmove", mouseMoveWithArgs);
        window.addEventListener("mouseup", mouseUp);
        window.addEventListener("touchend", mouseUp);
        window.addEventListener("mouseleave", mouseUp)
        updateTransition(false);
        isDragged.current = true;
    }, [active, updateTransition, shift, slideWidth,
             isDragged, endDragging, mouseMove, actionQueue])

    useEffect(()=>{
        if(!auto) return;
        let handle = setInterval(()=>{
            !isDragged.current && next();
        }, auto);
        return ()=>{
            clearInterval(handle);
        }
    }, [next, auto, isDragged])

    return (
        <div className="carousel-slider-container">
            <ul className="carousel-slider" ref={slider} onMouseDown={mouseDown} onTouchStart={mouseDown}
                onDrag={e => e.preventDefault()}>
                {slides && slides instanceof Array && slides.map((slide, index) => {
                    let classes = "slide";
                    if (visibleSlides % 2 !== 0 && index === Math.abs(balancedShift.current) + Math.floor(visibleSlides / 2)) {
                        classes += " slide--mid";
                    }
                    return (
                        <li key={slide.props.id || UUID.genV4()}
                            className={classes}
                            style={{width: minSlideWidth || "initial"}}>
                                {slide}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
export default Slider;