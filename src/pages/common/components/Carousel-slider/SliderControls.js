import React, {useCallback} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faCaretSquareRight, faCaretSquareLeft} from "@fortawesome/free-solid-svg-icons"
import {Button} from "react-bootstrap";
import "./slider-controls.scss"

const SliderControl = ({next , prev}) => {
    const nextClick = useCallback(()=>{
        next && next();
    }, [next])

    const prevClick = useCallback(()=>{
        prev && prev();
    }, [prev])

    return (
        <div className="slider-control-container">
            <Button className="slider-control-btn control-prev" onClick={prevClick}>
                 <FontAwesomeIcon icon={faCaretSquareLeft} className="prev-control icon"/>
            </Button>
            <Button className="slider-control-btn control-next" onClick={nextClick}>
                 <FontAwesomeIcon icon={faCaretSquareRight} className="prev-control icon"/>
            </Button>
        </div>
    )
}

export default SliderControl;