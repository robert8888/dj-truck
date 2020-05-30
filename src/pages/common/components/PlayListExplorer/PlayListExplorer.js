import React, { useEffect } from "react";
import { connect } from "react-redux";
import { rootDirRequest } from "./../../../../actions";
import Explorer from "./Explorer/Explorer";
import "./play-list-explorer.scss";
import PlayList from "./PlayList/PlayList";

const PlayListExplorer = ({logged, rootDirRequest, page, player, controls}) => {
    useEffect(()=>{
        if(logged){
            rootDirRequest();
        }
    }, [logged, rootDirRequest])


    return (
        <div className="play-list-explorer">
            <Explorer/>
            <PlayList page={page} player={player} controls={controls}/>
        </div>
    )
}

const mapStateToProps = state => ({
    logged : state.user.token,
})

const mapDispatchToProps = dispatch => ({
    rootDirRequest : () => dispatch(rootDirRequest())
})

export default connect(mapStateToProps, mapDispatchToProps)(PlayListExplorer);