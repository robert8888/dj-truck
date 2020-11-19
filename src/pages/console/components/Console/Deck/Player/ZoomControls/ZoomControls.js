import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faMinus} from "@fortawesome/free-solid-svg-icons"
import "./zoom-controls.scss";

const ZoomControls = ({zoomIn, zoomOut, className}) => {

    return (
        <div className={"scale-controls " + className}>
            <button
                className={"scale-controls__button scale-controls__button--zoom-in"}
                onClick={zoomIn}>
                <FontAwesomeIcon icon={faPlus}/>
            </button>
            <button
                className={"scale-controls__button  scale-controls__button--zoom-out"}
                onClick={zoomOut}>
                <FontAwesomeIcon icon={faMinus}/>
            </button>
        </div>
    )
}

export default ZoomControls;