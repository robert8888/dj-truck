import React, { useEffect } from "react";
import {connect} from "react-redux"
import "./play-list-explorer.scss"
import Explorer from "./Explorer/Explorer";
import PlayList from "./PlayList/PlayList";
import {rootDirRequest} from "./../../../../actions";

const PlayListExplorer = ({logged, rootDirRequest}) => {
    useEffect(()=>{
        if(logged){
            rootDirRequest();
        }
    }, [logged, rootDirRequest])

    return (
        <div className="play-list-explorer">
            <Explorer/>
            <PlayList/>
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