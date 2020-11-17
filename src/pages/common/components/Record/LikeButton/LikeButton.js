import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {reqAddRecordToFavorite, reqRemoveRecordFromFavorite} from "../../../../../actions"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import className from "classnames";
import "./like-button.scss"
import {useAuth0} from "../../../../../auth0/react-auth0-spa";

const LikeButton = ({recordId}) =>{
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    const state = useSelector(state => state.records.list.find(record => record.id === recordId)?.favorited || false)
    const dispatch = useDispatch();

    const classNames = className(
        "record-like-btn",
        {"btn--pressed": state}
    )

    const toggle = useCallback(()=>{
        if(!isAuthenticated)
            return loginWithRedirect({});

        state ?
              dispatch(reqRemoveRecordFromFavorite(recordId))
            : dispatch(reqAddRecordToFavorite(recordId));
    }, [state, dispatch, recordId, isAuthenticated, loginWithRedirect])

    return (
        <button className={classNames} onClick={toggle}>
            <FontAwesomeIcon icon={faHeart} />
        </button>
    )
}


export default LikeButton;