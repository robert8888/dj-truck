import React from "react";
import "./record-detail.scss"

const RecordDetails = ({title, user:{nickname} = {}}) => {


    return (
        <div className="player-controls-record-details">
            <div className="record-user-nickname">
                <span>{nickname}</span>
            </div>
            <div className="record-title">
                <span>{title}</span>
            </div>
        </div>
    )
}

export default RecordDetails