import React, { useCallback, useEffect, useRef, useState } from "react";
import { toRange } from "./../../../../../utils/math/argRanges";
import { formater } from "./../../../../../utils/time/timeFromater";
import useWindowSize from "./../../../Hooks/useWindowSize";
import "./progress-slider.scss";

//horizontal
const ProgressSlider = ({ player, seek}) => {
    const [progress, setProgress] = useState(0);
    const [buffered, setBuffred] = useState(0);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentDuration, setCurrentDuration] = useState(0);
    const isDragged = useRef();
    const seekTarget = useRef();
    const progressRef = useRef();
    const durationRef = useRef();

    const sliderArea = useRef(null);
    const sliderThumb = useRef(null);
    const sliderProgress = useRef(null);
    const sliderBufferd = useRef(null);
    const sliderTimePreview = useRef(null);

    const sliderAreaRectCached = useRef();
    const thumbAreaRectCached = useRef();

    const [ windowWidth, ] = useWindowSize();

    const getSliderAreaRect = useCallback(()=>{
        if(!sliderAreaRectCached.current){
            sliderAreaRectCached.current = sliderArea.current.getBoundingClientRect();
        }
        return sliderAreaRectCached.current;
    }, [sliderArea, sliderAreaRectCached])

    const getThumbAreaRect = useCallback(()=>{
        if(!thumbAreaRectCached.current){
            thumbAreaRectCached.current = sliderThumb.current.getBoundingClientRect();
        }
        return thumbAreaRectCached.current;
    }, [sliderThumb, thumbAreaRectCached])

    // const refrehsRects = useCallback(()=>{
    //     sliderAreaRectCached.current = null;
    //     thumbAreaRectCached.current = null;
    // },[ sliderAreaRectCached, thumbAreaRectCached])

    const setThumbPosition = useCallback((progress)=>{
        let position = 0;
        const sliderAreaRect = getSliderAreaRect();
        const thumbRect = getThumbAreaRect();
        position = sliderAreaRect.width * progress ;
        sliderProgress.current.style.transform = `scaleX(${position}) translateX(50%)`;
        position -= (thumbRect.width / 2) ;  
        sliderThumb.current.style.transform = `translateX(${position}px)`;
    }, [sliderThumb, getSliderAreaRect, getThumbAreaRect])

    const setBuffredPosition = useCallback((buffered) => {
        const sliderAreaRect = getSliderAreaRect();
        if(!sliderAreaRect){
            return;
        }
        const position = sliderAreaRect.width * buffered;
        sliderBufferd.current.style.transform = `scaleX(${position}) translateX(50%)`;
    }, [sliderBufferd, getSliderAreaRect])

    useEffect(()=>{
        setBuffredPosition(buffered)
    }, [buffered, setBuffredPosition])

    useEffect(()=>{
        setCurrentTime(currentDuration * progress);
        setThumbPosition(progress);
     }, [progress, currentDuration, setCurrentTime, setThumbPosition])

    const refreshBuffered = useCallback(
            () => setBuffredPosition(buffered), 
            [buffered, setBuffredPosition]
        );
    const refreshProgress = useCallback(
            () => setThumbPosition(progress), 
            [progress, setThumbPosition]
        )

    useEffect(()=>{
        refreshBuffered();
        refreshProgress();
    },[windowWidth, refreshBuffered, refreshProgress])


    const setProgressHandler = useCallback((progress)=>{
        if(!isDragged.current){
            setProgress(progress);
            progressRef.current = progress
        }
    }, [isDragged, progressRef])

    const getProgress = useCallback(()=>{
        return {
            progress: progressRef.current,
            duration: durationRef.current,
        };
    }, [progressRef, durationRef])

    useEffect(()=>{
        if(currentRecord){
           setCurrentDuration(currentRecord.duration);
           durationRef.current = currentRecord.duration;
        }
    }, [currentRecord, setCurrentDuration, durationRef])

    useEffect(()=>{
        if(!player){
            return;
        }

        player.subscribeProgress('#', setProgressHandler);
        player.subscribeCurrent(setCurrentRecord);
        player.subscribeBuffred(setBuffred);
        player.addProgressProvider("#", getProgress)
        setCurrentRecord(player.getCurrent());
        return () => {
            console.log("unmouting slider")
            player.unSubscribeProgress('#', setProgressHandler);
            player.unSubscribeCurrent(setCurrentRecord);
            player.unSubscribeBuffered(setBuffred);
            player.removeProgressProvider("#", getProgress)
        }
    }, [player, setProgressHandler, getProgress])

    const thumbDraging = useCallback( (areaRect, e) => {
       const x = e.clientX - areaRect.left;
       let progress = x / areaRect.width;
       progress = toRange(progress, 0 ,1);
       seekTarget.current = progress;
       setProgress(progress)
    }, [])

    const thumbMouseDown = useCallback((e)=>{
        if(currentDuration === 0){
            return;
        }
        const sliderAreaRect = getSliderAreaRect();
        const thumbDragingWithArgs = thumbDraging.bind(null, sliderAreaRect)
        isDragged.current = true;
        const mouseup = () => {
            window.removeEventListener('mouseup', mouseup);
            window.removeEventListener('mousemove', thumbDragingWithArgs);
            isDragged.current = false;
            seek({progress : seekTarget.current});
            seekTarget.current = null;
        }
        window.addEventListener('mousemove', thumbDragingWithArgs)
        window.addEventListener('mouseup', mouseup)
    }, [thumbDraging, 
        isDragged,
        seek, 
        seekTarget, 
        currentDuration,
        getSliderAreaRect
    ])

    const areaMouseDown = useCallback((e)=>{
        const sliderAreaRect = getSliderAreaRect();
        const thumbRect = getThumbAreaRect();
        if(e.target === sliderThumb.current){
            return;
        }
        const x = e.clientX - sliderAreaRect.left  + (thumbRect.width / 2);
        let progress = x / sliderAreaRect.width  ;
        progress = toRange(progress, 0 , 1)
        seek({progress})
    }, [seek, getSliderAreaRect, getThumbAreaRect])

    const areaMouseMove = useCallback( e =>{
        const sliderAreaRect = getSliderAreaRect();
        const thumbRect = getThumbAreaRect();
        const x = e.clientX - sliderAreaRect.left  + (thumbRect.width / 2);
        let progress = x / sliderAreaRect.width;
        progress = toRange(progress, 0 , 1)
        const time = currentDuration * progress;
        const str = formater.secondsToStr(time / 1000);
        sliderTimePreview.current.dataset.value = time ? str : "";
        sliderTimePreview.current.style.transform = `translateX(${x}px)`
    }, [currentDuration , sliderTimePreview, getSliderAreaRect, getThumbAreaRect])

    const areaMouseEnter = useCallback( e => {
        sliderTimePreview.current.classList.add("preview--visible")
    }, [sliderTimePreview])

    const areaMouseLeave = useCallback( e => {
        sliderTimePreview.current.classList.remove("preview--visible")
    }, [sliderTimePreview])


    return (
        <div className="seek-slider">
            <div className="slider-time time-current">
                 <span>{formater.secondsToStr(currentTime / 1000)}</span>
            </div>
            <div className="slider-active-area" 
                 ref={sliderArea}
                 onMouseDown={areaMouseDown}
                 onMouseEnter={areaMouseEnter}
                 onMouseLeave={areaMouseLeave} 
                 onMouseMove={areaMouseMove}
                 draggable="false">
                    <div className="slider-buffered" 
                         ref={sliderBufferd} 
                         draggable="false"/>
                    <div className="slider-progress" 
                         ref={sliderProgress} 
                         draggable="false"/>
                    
                    <div className="slider-thumb" 
                         ref={sliderThumb} 
                         onMouseDown={thumbMouseDown} 
                         draggable="false"/>
                    <div className="slider-time-preview"  
                         ref={sliderTimePreview} 
                         data-value=""/>
            </div>
            <div className="slider-time time-duration">
                <span>{formater.secondsToStr(currentDuration/1000)}</span>
            </div>
        </div>
    
    )
}

export default ProgressSlider;

