import React, { useState, useCallback, useMemo, Fragment, useEffect, useRef } from "react";
import IconBar from "./../../IconBar/IconBar"
import { useFormatRelative } from "./../../../Hooks/useFormatDate";
import "./comment.scss";
import { Form, Button } from "react-bootstrap";
import useAutoHeightTextarea from "../../../Hooks/useAutoHeightTextarea";
import useEmoticons from "../../../Hooks/useEmoticons";

const CommentContent = ({
    header,
    text,
    date: timestamp,
    editable,
    onChange,
    onDelete = () => null,
    creationMode }) => {

    const content = useRef();
    const [editMode, setEditMode] = useState(false);

    const [autoHeight] = useAutoHeightTextarea();
    const [emotiControl, Emoticons] = useEmoticons();

    const [formatRelative] = useFormatRelative();
    const dateFormated = useMemo(() => {
        if (!timestamp) return "";
        return formatRelative(timestamp, { timezone: true })
    }, [timestamp, formatRelative])




    const setContentRef = useCallback(ref => {
        content.current = ref;
        emotiControl.current = ref;

        if (text && content.current) {
            content.current.value = text;
        }
        if(!creationMode){
            autoHeight(ref)
        }
    }, [text, content])


    const onBlur = useCallback(() => {
         //(content.current.value === "") ? setEditMode(false) : setEditMode(true);
    }, [content, setEditMode])


    const onSubmit = useCallback((e) => {
        e.preventDefault();
        if (!onChange) return;
        setEditMode(false)
        onChange(content.current.value)
        if (creationMode) {
            content.current.value = "";
        }
    }, [content, onChange, setEditMode])

    return (
        <Form onSubmit={onSubmit}
            onFocus={setEditMode.bind(null, true)}
            onBlur={onBlur}>
            <Form.Group>
                <header>
                    <Form.Label>
                        {header}
                    </Form.Label>
                    <aside className={(editable ? "editable" : "")}>
                        <span className='comment-publish-date'> {dateFormated}</span>
                        {editable && !creationMode &&
                            <IconBar items={{
                                edit: setEditMode.bind(null, true),
                                delete: onDelete.bind(null)
                            }}
                            />}
                    </aside>
                </header>

                <Form.Control
                    className="record-comments-control"
                    type="textarea"
                    as="textarea"
                    name="comment-conntent"
                    disabled={!editMode && !creationMode}
                    ref = {setContentRef} />
                {editMode && (
                    <Fragment>
                        <Button type="submit">Post</Button>
                        <Emoticons />
                    </Fragment>
                )}
            </Form.Group>

        </Form>
    )
}

export default CommentContent;