import React, { useMemo, useCallback, useState, useRef } from "react";
import classNames from "classnames";
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faThLarge } from "@fortawesome/free-solid-svg-icons";
import {Button} from "react-bootstrap";
import "./edit.scss";

const Edit = ({ active, type, children, onChange = ifEmpty => null }) => {
    const [editMode, setEditMode] = useState(false);
    const controlRef = useRef();

    const buttonClasses = useMemo(() => classNames(
        'edit-btn',
        {
            "edit-btn--active": active,
            "edit-btn-before": (type.startsWith("text")),
            "edit-btn-over": (type === "image"),
        }
    ), [active])

    const catchBtnRef = useCallback((ref) => {
        if (!ref) {
            return;
        }

        ref.parentElement.classList.add("relative");
    }, [])
    //onsole.log("chioldren", children)

    const content = useMemo(() => {
        if (!editMode) {
            return children;
        } else {
            switch (type) {
                case "image": {
                    return (
                        <>
                            <input
                                type="file"
                                accept="image/png, image/jpeg"
                                style={{ display: "none" }}
                                ref={ref => ref && ref.click()}
                                onChange={event => {
                                    const file = event.target.files[0];
                                    onChange(file);
                                    setEditMode(false)
                                }}/>
                            <button
                                className={buttonClasses}
                                ref={catchBtnRef}
                                onClick={setEditMode.bind(null, edit => !edit)}>
                                <FontAwesomeIcon icon={faPen} />
                            </button>
                            {children}
                        </>
                    )
                }

                case "text": return (
                    <Form.Control
                        type={type}
                        className="edit-text-control"
                        defaultValue={children.props.children}
                        onKeyDown={e => {
                            if (e.key !== "Enter") {
                                return;
                            }
                            onChange(e.target.value);
                            setEditMode(false)
                        }} />
                )
                case "textarea":
                    let input;
                    return (
                        <>
                            <Form.Control
                                type={type}
                                as="textarea"
                                className="edit-text-control"
                                defaultValue={children.props.children}
                                ref={ref => input = ref} />
                            <Button className={"edit-btn-save"} 
                                onClick={() => {
                                    setEditMode(false)}
                                }>
                                    Cancel
                            </Button>
                            <Button className={"edit-btn-save"} 
                                onClick={() => {
                                    onChange(input.value);
                                    setEditMode(false)}
                                }>
                                    Save
                            </Button>
                        </>
                    )

            }

        }
    }, [children, editMode, onChange, setEditMode])

    return (
        <>
            {active && !editMode &&
                <button
                    className={buttonClasses}
                    ref={catchBtnRef}
                    onClick={setEditMode.bind(null, edit => !edit)}>
                    <FontAwesomeIcon icon={faPen} />
                </button>
            }
            {content}
        </>
    )
}

export default Edit;