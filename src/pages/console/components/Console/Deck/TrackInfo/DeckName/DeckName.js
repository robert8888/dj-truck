import React from "react";
import "./deck-name.scss";

const DeckName = ({channel}) => {
    return (
        <div className={"track-info__deck-name track-info__deck-name--" +channel}>
            <h6 className={"track-info__deck-name__text"}>{channel}</h6>
        </div>
    )
}

export default DeckName;