import React from "react";
import {connect} from "react-redux";
import {reqAddRecordToFavorite, reqRemoveRecordFromFavorite} from "./../../../../../actions"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import className from "classnames";
import "./like-button.scss"

const LikeButton = ({state = false, toggle}) =>{
    const classNames = className(
        "record-like-btn",
        {"btn--pressed": state}
    )

    return (
        <button className={classNames} onClick={toggle}>
            <FontAwesomeIcon icon={faHeart} />
        </button>
    )
}

const mapDispatchToState = (dispatch, ownProps) =>({
    toggle : () => {
        if(!ownProps.recordId) return;
        (!ownProps.state) ? 
              dispatch(reqAddRecordToFavorite(ownProps.recordId))
            : dispatch(reqRemoveRecordFromFavorite(ownProps.recordId))
    }
})

export default connect(null, mapDispatchToState)(LikeButton);