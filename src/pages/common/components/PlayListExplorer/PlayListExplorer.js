import React, { useEffect } from "react";
import { connect } from "react-redux";
import { rootDirRequest } from "./../../../../actions";
import Explorer from "./Explorer/Explorer";
import "./play-list-explorer.scss";
import PlayList from "./PlayList/PlayList";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

const PlayListExplorer = ({logged, rootDirRequest, page, player, controls}) => {
    useEffect(()=>{
        if(logged){
            rootDirRequest();
        }
    }, [logged, rootDirRequest])


    return (
        <ErrorBoundary>
            <div className="play-list-explorer">
                <ErrorBoundary>
                    <Explorer/>
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