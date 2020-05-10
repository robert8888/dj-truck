import React from "react";
import "./explorer.scss";
import MenuBar from "./MenuBar/MenuBar";
import ExplorerTree from "./ExplorerTree/ExplorerTree";


const Explorer = props => {


    return (
        <div className="explorer">
            <MenuBar/>
            <ExplorerTree/>
        </div>
    )
}


export default Explorer;