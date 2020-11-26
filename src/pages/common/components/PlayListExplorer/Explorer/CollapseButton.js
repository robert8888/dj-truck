import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileMedicalAlt} from "@fortawesome/free-solid-svg-icons";
import "./collapse-button.scss"

const ExplorerCollapseButton = ({onClick}) => {
    return (
        <div className={"explorer__collapse-button__container"}>
            <button onClick={onClick} className="explorer__collapse-button">
                <FontAwesomeIcon icon={faFileMedicalAlt}/>
            </button>,
        </div>
    )
}

export default ExplorerCollapseButton;