import React from "react";
import "./play-list-explorer.scss"
import Explorer from "./Explorer/Explorer";
import PlayList from "./PlayList/PlayList";

const PlayListExplorer = props => {


    return (
        <div className="play-list-explorer">
            <Explorer/>
            <PlayList/>
        </div>
    )
}


export default PlayListExplorer;