import React, { useEffect, useState} from "react";
import { connect } from "react-redux";
import { rootDirRequest } from "actions";
import Explorer from "./Explorer/Explorer";
import "./play-list-explorer.scss";
import PlayList from "./PlayList/PlayList";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import CollapseButton from "./Explorer/CollapseButton";

const PlayListExplorer = ({logged, rootDirRequest, page, player, controls}) => {
    const [explorerCollapseState, setExplorerCollapseState] = useState(true)
    useEffect(()=>{
        if(logged){
            rootDirRequest();
        }
    }, [logged, rootDirRequest])


    useEffect(()=>{
        const handleClick = event => {
            if(event.target.closest(".explorer, .explorer__collapse-button") ||
                !event.target.closest("body"))
                    return;
            setExplorerCollapseState(true)
        }
        window.document.addEventListener("click", handleClick)
        return () => {
            window.document.removeEventListener("click", handleClick)
        }
    }, [setExplorerCollapseState])

    return (
        <ErrorBoundary>
            <CollapseButton onClick={()=>setExplorerCollapseState(state => !state)}/>
            <div className="play-list-explorer">
                <ErrorBoundary>
                    <Explorer collapse={explorerCollapseState}/>
                </ErrorBoundary>

                <ErrorBoundary>
                    <PlayList page={page} player={player} controls={controls}/>
                </ErrorBoundary>
            </div>
        </ErrorBoundary>
    )
}

const mapStateToProps = state => ({
    logged : state.user.token,
})

const mapDispatchToProps = dispatch => ({
    rootDirRequest : () => dispatch(rootDirRequest())
})

export default connect(mapStateToProps, mapDispatchToProps)(PlayListExplorer);