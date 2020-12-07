import React from "react";
import "./explorer.scss";
import MenuBar from "./MenuBar/MenuBar";
import ExplorerTree from "./ExplorerTree/ExplorerTree";
import ErrorBoundary from "./../../ErrorBoundary/ErrorBoundary";
import classNames from "classnames";

const Explorer = ({collapse}) => {

    return (
        <div className={classNames("explorer", {"explorer--collapsed": collapse})}>
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