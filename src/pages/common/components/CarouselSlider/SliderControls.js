import React, {useCallback, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowCircleLeft,
    faArrowCircleRight, faCircle
} from "@fortawesome/free-solid-svg-icons"
import {faCircle as faCircleOpen} from "@fortawesome/free-regular-svg-icons";
import {Button} from "react-bootstrap";
import "./slider-controls.scss"

const SliderControl = ({next , prev, set, update: updateHandle, size}) => {
    const [current, setCurrent] = useState();

    const nextClick = useCallback(()=>{
        next && next();
    }, [next])

    const prevClick = useCallback(()=>{
        prev && prev();
    }, [prev])

    const setClick = useCallback((target) => {
        set && set(target)
    }, [set])

    const updateCurrent = useCallback((current)=>{
        setCurrent(current);
    }, [setCurrent])

    useEffect(() => updateHandle && updateHandle(updateCurrent),
        [updateHandle, updateCurrent])

    return (
        <div className="slider-control-container">
            <Button className="slider-control-btn control-prev" onClick={prevClick}>
                 <FontAwesomeIcon icon={faArrowCircleLeft} className="prev-control icon"/>
            </Button>
            {size && Array(size).fill(1).map(( _, index) =>{
                const icon = index === current ?  faCircleOpen : faCircle;
                return (
                    <Button key={"slider-control-" + index} className="slider-control-btn" onClick={setClick.bind(null, index)}>
                        <FontAwesomeIcon icon={icon} className="prev-control icon"/>
                    </Button>
                )
            })}
            <Button className="slider-control-btn control-next" onClick={nextClick}>
                 <FontAwesomeIcon icon={faArrowCircleRight} className="prev-control icon"/>
            </Button>
        </div>
    )
}

export default SliderControl;