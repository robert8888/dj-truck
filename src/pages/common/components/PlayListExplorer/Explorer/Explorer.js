import React from "react";
import "./explorer.scss";
import MenuBar from "./MenuBar/MenuBar";
import ExplorerTree from "./ExplorerTree/ExplorerTree";
import ErrorBoundary from "./../../ErrorBoundary/ErrorBoundary";

const Explorer = props => {
    console.log("reder exp")
    return (
        <div className="explorer">
            <ErrorBoundary>
               <MenuBar/>
            </ErrorBoundary>
            <ErrorBoundary>
              <ExplorerTree/>
            </ErrorBoundary>

        </div>
    )
}


export default Explorer;