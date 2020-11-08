import React, {useCallback} from "react";
import {connect, useDispatch, useSelector} from "react-redux";
import {reqAddRecordToFavorite, reqRemoveRecordFromFavorite} from "./../../../../../actions"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import className from "classnames";
import "./like-button.scss"

const LikeButton = ({recordId}) =>{
    const state = useSelector(state => state.records.list.find(record => record.id === recordId)?.favorited || false)
    const dispatch = useDispatch();

    const classNames = className(
        "record-like-btn",
        {"btn--pressed": state}
    )

    const toggle = useCallback(()=>{
        state ?
              dispatch(reqRemoveRecordFromFavorite(recordId))
            : dispatch(reqAddRecordToFavorite(recordId));
    }, [state])

    return (
        <button className={classNames} onClick={toggle}>
            <FontAwesomeIcon icon={faHeart} />
        </button>
    )
}


export default LikeButton;