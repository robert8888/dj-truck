import React, {useState, useEffect, useRef, useCallback, useMemo} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeUp, faVolumeMute  } from '@fortawesome/free-solid-svg-icons';
import {toRange} from "./../../../../../utils/math/argRanges";
import classNames from "classnames";
import "./volume.scss"

const Volume = ({setVolume}) => {
    const [level , setLevel] = useState(null);
    const [preMuted, setPremutedLevel] = useState(null);
    const [icon , setIcon] = useState(faVolumeUp);
    const [expand , setExpand] = useState(false);
    const slider = useRef();
    const sliderGuide = useRef();
    const sliderProgress = useRef();
    const sliderThumb = useRef();
    const volumeBtn = useRef();

    useEffect(()=>{
        let level = localStorage.getItem('volume-level') || 1;
        setLevel(level)
    }, [setLevel]);

    useEffect(()=>{
        if(level === 0){
            setIcon(faVolumeMute)
        } else {
            setIcon(faVolumeUp)
        }
        if(setVolume && level !== null ){
            setVolume(level);
            localStorage.setItem('volume-level', level);
        }
    }, [level, setIcon, setVolume])

    const sliderMouseDown = useCallback((e)=>{
        if(e.target === sliderThumb.current){
            return;
        }
        const guide = sliderGuide.current.getBoundingClientRect();
        let level = (guide.height -  (e.clientY - guide.top)) / guide.height;
        level = toRange(level, 0 ,1);
        setLevel(level)
    }, [sliderGuide, setLevel])

    const updatePosition = useCallback((level) => {
        const position = sliderGuide.current.getBoundingClientRect().height * level;
        sliderThumb.current.style.transform = `translateY(-${position}px)`;
        sliderProgress.current.style.transform = `scaleY(${position}) translateY(-50%)`
    }, [sliderProgress, sliderThumb, sliderGuide])

    useEffect(()=>{
        updatePosition(level);
    }, [level, updatePosition])

    const windowMouseMove = useCallback((shiftY, e)=>{
        const guide = sliderGuide.current.getBoundingClientRect();
        let level = (guide.height - (e.clientY - guide.top + shiftY)) / guide.height;
        level = toRange(level, 0 ,1);
        setLevel(level)
    }, [sliderGuide, setLevel])

    const thumbMouseDown = useCallback((e)=>{
        const thumb = sliderThumb.current.getBoundingClientRect()
        const shiftY = (thumb.height / 2 )  - (e.clientY - thumb.top);
        const windowMM = windowMouseMove.bind(null, shiftY);
        window.addEventListener('mousemove', windowMM)
        const abordDrag = e => e.preventDefault()
        const mouseUp = ()=>{
            window.removeEventListener('mousemove', windowMM);
            window.removeEventListener('mouseup', mouseUp);
            window.removeEventListener('dragstart', abordDrag);
        }
        window.addEventListener('mouseup', mouseUp);
        window.addEventListener('dragstart', abordDrag);
    }, [sliderThumb, windowMouseMove])

    const colapse = useCallback((e)=>{
        if( e.target !== slider.current && 
            e.target.parentElement !== slider.current &&
            e.target.closest('button') !== volumeBtn.current ){
            setExpand(false)
        }
    }, [slider, setExpand]);

    useEffect(()=>{
        if(expand){
            window.addEventListener('mousedown', colapse)
            updatePosition(level)
        } else {
            window.removeEventListener('mousedown', colapse);
        }
    }, [expand, 
        level,
        colapse,
        updatePosition,])

    const sliderClassNames = useMemo(()=>{
        return classNames(
            'volume-slider', {
                'expand' : expand,
            }
        )
    }, [expand])

    const btnClick = useCallback(()=>{
        if(!expand){
            setExpand(true)
        } else if(expand){
            if(level){
                setPremutedLevel(level)
                setLevel(0)
            } else if(preMuted){
                setLevel(preMuted);
                setPremutedLevel(null);
            }
        }
    }, [expand,
        setExpand,
        level,
        setLevel, 
        preMuted, 
        setPremutedLevel])

    return (
        <div className="volume">
            <button className="volume-btn" onClick={btnClick} ref={volumeBtn}>
                <FontAwesomeIcon icon={icon}/>
            </button>
            <div className={sliderClassNames} ref={slider} onMouseDown={sliderMouseDown} draggable="false">
                <div className="volume-slider-guide" ref={sliderGuide} draggable="false"/>
                <div className="volume-slider-progress" ref={sliderProgress} draggable="faslse"/>
                <div className="volume-slider-thumb" ref={sliderThumb} onMouseDown={thumbMouseDown} draggable="false"/>
            </div>
        </div>
    )
}

export default Volume;