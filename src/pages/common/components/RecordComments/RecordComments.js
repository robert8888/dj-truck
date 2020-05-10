import React, { useState, useCallback, Fragment } from "react";
import {reqPostComment, reqUpdateComment, reqDeleteComment} from "./../../../../actions";
import {connect} from "react-redux";
import CommentContent from "./Comment/Comment";

import {useRecordPlayer} from "./../../Hooks/useRecordPlayer";
import "./record-comments.scss";


const RecordComments = ({
        userId,
        record, 
        postComment,
        updateComment,
        deleteComment, 
    }) =>{
    const [, player] = useRecordPlayer();

    const post = useCallback((text) => {
        if(!postComment || !record || !userId) return;

        let timeOfComment = 0;
        const currentPlayback = player.getCurrent();
        if(currentPlayback.id === record.id){
            timeOfComment = currentPlayback.progress * currentPlayback.duration;
        }

        const commentData = {
            recordId : record.id,
            userId: userId,
            text: text,
            time: timeOfComment,
        }
        postComment(commentData)
    },[postComment, record, userId])

    const update = useCallback((id, text) => {
        if(!userId || !record) return;
        const commentData = {
            commentId : id,
            text : text,

        }
        updateComment(commentData)
    }, [updateComment, userId, record])

    const onDelete = useCallback( id => {
        if(!userId) return;
        deleteComment(id)
    }, [userId, deleteComment])

    const onCommentChange = useCallback((id, text) => {
        if(!text) return;
        
        if(!id){
            post(text);
        } else {
            update(id, text)
        }
    },[ post, update ])



    return (
        <div className="record-comments">
            {/* Creating new post field */}

            {userId && 
                <Fragment>
                    <h6>Create new comment: </h6>
                    <div className="comment-post-form">
                    <CommentContent 
                        creationMode
                        onChange={ onCommentChange.bind(null, null)}/>
                    </div>
                </Fragment>
            }
            {/* Comments list */}
            
            { (record && record.comments && record.comments.length > 0) &&
              <Fragment>
                <h6>Comments: </h6>
                {record.comments.map( comment => (
                    <CommentContent key={'comment - ' + comment.id}
                        header={comment.user.nickname}
                        editable={comment.user.id === userId}
                        onChange={onCommentChange.bind(null, comment.id)}
                        onDelete={onDelete.bind(null, comment.id)}
                        date={comment.createdAt}
                        text={comment.text}/>
                ))}
              </Fragment>
            }

                       
        </div>
    )
}
const mapStateToProps = state => ({
    record: state.records.currentRecord,
    userId: state.user.dbId,
})

const mapDispatchToProps = dispatch => ({
    postComment: (data) => dispatch(reqPostComment(data)),
    updateComment : (data) => dispatch(reqUpdateComment(data)),
    deleteComment: (id) => dispatch(reqDeleteComment(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RecordComments)