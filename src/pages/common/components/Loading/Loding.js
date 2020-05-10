import React, { useEffect } from "react";
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import {PulseLoader} from "react-spinners";
import "./loading.scss";
import { connect } from "react-redux";

const Loading = ({dispatch}) => {

    useEffect(()=>{
        dispatch(showLoading())
        return () =>{
            dispatch(hideLoading());
        }
    },[dispatch])

    return (
        <div className="loading suspense">
            <PulseLoader className="spiner" size="20px"/>
        </div>
    )
}

export default connect()(Loading)